import { useWeb3React } from "@web3-react/core";
import config from "config/config";
import { contractsContext } from "contracts/ContractContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "store/actions/events";
import { useActiveWeb3React } from "../wallet";

const useSubscribe = () => {
    const { selectedNetwork } = useSelector(({app}) => app);
    const assets = require(`./${selectedNetwork.toLowerCase()}.json`);
    const {library: web3} = useWeb3React(config.web3ProviderId);
    const { account } = useActiveWeb3React();
    const [subscribedEvents,  setSubscribedEvents] = useState({});
    const [called,  setCalled] = useState(null);
    const contracts = useContext(contractsContext);
    const dispatch = useDispatch();
    
    const subscribeLogEvent = () => {
        assets.forEach(({name, events} )=> {
            try {
                const contract = contracts[name];
                if(!contract) return;
                events.forEach(eventName => {
                    const eventJsonInterface = web3.utils._.find(
                        contract._jsonInterface,
                        o => o.name === eventName && o.type === 'event',
                    )
                    if(!['openposition', "closeposition", "deposit", "withdraw", "approval"].includes(eventName.toLowerCase())){
                        const subscription = web3.eth.subscribe('logs', {
                            address: contract.options.address,
                            topics: [eventJsonInterface.signature, web3.utils.padLeft(account, 64)]
                        }, (error, result) => {
                            if (!error) {
                                // console.log('...result: ', result);
                                const eventObj = web3.eth.abi.decodeLog(
                                    eventJsonInterface.inputs,
                                    result.data,
                                    result.topics.slice(1),
                                    )
                                    // console.log(`New ${eventName} of ${name}!`, eventObj);
                                    dispatch(addEvent(name, eventName, eventObj))
                                }
                            })

                            setSubscribedEvents(prev => ({
                                ...prev,
                                [name]: {
                                    ...prev[name],
                                    [eventName]: subscription
                                }
                            }))
                            console.log(`subscribed to event '${eventName}' of contract '${name}' `) 
                        }
                });
            } catch (error) {
                console.log(error);
                console.log(name);
            }
        });
    } 
    useEffect(() =>{
        return () => {
            const events = Object.values(Object.values(subscribedEvents));
            events.forEach((subs) => {
                Object.values(subs).forEach((sub)=>{
                    sub.unsubscribe(function(error, success){
                        if(error) console.log("error: ", error);
                        if(success)
                            console.log('Successfully unsubscribed!');
                    });
                })
            }) 
        }
    },[subscribedEvents])

    useEffect(() => {
        if(called || !contracts || !account) return
        setCalled(true);
        subscribeLogEvent();
        // eslint-disable-next-line
    }, [contracts, account]);

    return useMemo( ()=> { return null }, []);
}

export default useSubscribe;