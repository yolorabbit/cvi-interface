import platformConfig from 'config/platformConfig';
import moment from 'moment';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { commaFormatted, customFixed, toBN, toDisplayAmount } from 'utils';
import { useEvents } from './useEvents';
import { useActiveWeb3React } from './wallet';
import * as TheGraph from 'graph/queries';
import { contractsContext } from 'contracts/ContractContext';
import { setData } from 'store/actions/wallet';
import config from 'config/config';

const useHistoryEvents = () => {
    const { selectedNetwork } = useSelector(({app}) => app); 
    const wallet = useSelector(({wallet}) => wallet);
    const [subs, setSubs] = useState([]);
    const { library, account } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const dispatch = useDispatch();
    const { getEventsFast } = useEvents();
    let fromWei = library?.utils?.fromWei;
    let getBlock = library?.eth?.getBlock;
    const historyRef = useRef();

    const opt = useMemo(() => ({
        filter: { account },
        fromBlock: 0,
        toBlock: 'latest',
    }), [account]);

    const contractState = useMemo(() => (config.isMainnet ? {
        positions: {
            closePositions: 'Sell',
            openPositions: 'Buy',
        },
        liquidities: {
            deposits: 'Deposit',
            withdraws: 'Withdraw'
        }
    } : {
        positions: {
            OpenPosition: 'Buy',
            ClosePosition: 'Sell'
        },
        liquidities: {
            Withdraw: 'Withdraw',
            Deposit: 'Deposit'
        }
    }), []);

    const mapper = useMemo(() => {
        return {
            positions: async function(event, type, activeToken) {
                let block = await getBlock(event.blockNumber);
                const { tokenAmount, feeAmount, cviValue } = config.isMainnet ? event : event.returnValues;
                const actionDate = block.timestamp * 1000
                const amount = activeToken.key === 'eth' ? fromWei(tokenAmount) : toDisplayAmount(tokenAmount, activeToken.decimals);
                const fees = activeToken.key === 'eth' ? fromWei(feeAmount) : toDisplayAmount(feeAmount, activeToken.decimals);
                const netAmount = activeToken.key === 'eth' ? fromWei(toBN(tokenAmount).sub(toBN(feeAmount))) : toDisplayAmount(toBN(tokenAmount).sub(toBN(feeAmount)).toString(), activeToken.decimals);
                
                return Promise.resolve({
                    transactionHash: event.transactionHash,
                    date: moment(actionDate).format('DD/MM/YYYY'),
                    timestamp: actionDate,
                    type: contractState.positions[type],
                    index: cviValue / 100,
                    leverage: 1,
                    amount: `${commaFormatted(customFixed(amount, activeToken.decimals))} ${activeToken.key.toUpperCase()}`,
                    fees: `${commaFormatted(customFixed(fees, activeToken.decimals))} ${activeToken.key.toUpperCase()}`,
                    netAmount: `${commaFormatted(customFixed(netAmount, activeToken.decimals))} ${activeToken.key.toUpperCase()}`
                });
            },
            liquidities: async function(event, type, activeToken) {
                let block = await getBlock(event.blockNumber);
                const { tokenAmount, feeAmount } = config.isMainnet ? event : event.returnValues;
                const actionDate = block.timestamp * 1000
                const amount = activeToken.key === 'eth' ? fromWei(toBN(tokenAmount).sub(toBN(feeAmount))) : toDisplayAmount(toBN(tokenAmount).sub(toBN(feeAmount)).toString(), activeToken.decimals);

                return Promise.resolve({
                    transactionHash: event.transactionHash,
                    date: moment(actionDate).format('DD/MM/YYYY'),
                    timestamp: actionDate,
                    type: contractState.liquidities[type],
                    amount: `${commaFormatted(customFixed(amount, activeToken.decimals))} ${activeToken.key.toUpperCase()}`,
                });
            }
        }
    }, [fromWei, getBlock, contractState])

    const fetchPastEvents = useCallback(async function(view, activeToken) {
        if(!activeToken) return;
       
        if(wallet[view] !== null) return;
        let events = [];
        if(config.isMainnet) {
            events = await TheGraph[`account_${view}`](account, contracts[activeToken.rel.platform]._address, 0)
            events = Object.values(events).map((_events, idx) => _events.map((event)=> ({...event, timestamp: Number(event.timestamp), event: contractState[view][Object.keys(events)[idx]] }))).flat();
        } else {
            events = await getEventsFast([{
                contract: contracts[activeToken.rel.platform], 
                events: { 
                    [Object.keys(contractState[view])[0]]: [{ account }], 
                    [Object.keys(contractState[view])[1]]: [{ account }] 
                } 
            }], {});
        }
       
        if(events.length) {
            events = await Promise.all(events.map(event => mapper[view](event, event.event, activeToken)));
        }

        events = events.sort((a, b) => (b.timestamp < a.timestamp) ? -1 : 1);
        dispatch(setData(view, events));
    }, [account, contractState, contracts, dispatch, getEventsFast, mapper, wallet]) 

    
    const subscribe = useCallback(async function(view, type, eventType, activeToken) {
        const sub = contracts[activeToken.rel.platform].events[eventType](({...opt, fromBlock: 'latest'}))
        if(!!subs.find((s) => s[`${eventType}-${activeToken.key}`])) return;
        
        sub.on("connected", function(subscriptionId){
            console.log(`Subscribe to event: ${`${eventType}-${activeToken.key}`}, Subscription ID: ${subscriptionId}`);
        })
        .on('data', async function(data) {
            const d = await mapper[view]({
                ...data,
                returnValues: {
                    ...data.returnValues,
                    blockNumber: data.blockNumber,
                    transactionHash: data.transactionHash
                },
            }, type, activeToken);

            dispatch(setData(view, d, true));
        })
        .on('error', console.log);

        setSubs(prev => prev.concat({ [`${eventType}-${activeToken.key}`]: sub }) );
    }, [contracts, dispatch, mapper, opt, subs])

    useEffect(() => {
        if(!selectedNetwork || !contracts || !account || typeof getEventsFast !== 'function') return;
        historyRef.current = setTimeout(() => {
            Object.values(platformConfig.tokens[selectedNetwork]).filter(({soon}) => !soon).forEach(token => {
                fetchPastEvents("positions", token);   
                subscribe("positions", "Buy", 'OpenPosition', token);
                subscribe("positions", "Sell", 'ClosePosition', token);

                fetchPastEvents("liquidities", token);
                subscribe("liquidities", "Deposit", 'Deposit', token);
                subscribe("liquidities", "Withdraw", 'Withdraw', token);
            });
        }, 1000);
        
        return () => {
            if(historyRef.current) clearTimeout(historyRef.current);
        }
    }, [selectedNetwork, contracts, account, fetchPastEvents, getEventsFast, subscribe])



    return null;
}

export default useHistoryEvents;