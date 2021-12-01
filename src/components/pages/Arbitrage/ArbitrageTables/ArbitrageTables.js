
import { useActiveToken, useIsTablet } from "components/Hooks";
import { appViewContext } from 'components/Context';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import arbitrageConfig, { activeViews } from 'config/arbitrageConfig';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Container from 'components/Layout/Container';
import TabsForm from 'components/TabsForm';
import './ArbitrageTables.scss';
import moment from 'moment';
import { customFixed, toBN, toDisplayAmount } from 'utils/index';
import { upperFirst } from "lodash";
import { MAX_PERCENTAGE } from "contracts/utils";
import { getLatestBlockTimestamp } from 'contracts/web3Api';
import { useWeb3React } from "@web3-react/core";
import config from "config/config";

const ArbitrageTables = () => {
    const [activeTab, setActiveTab] = useState();
    const { activeView } = useContext(appViewContext);
    return useMemo(() => {
        if(!activeView) return null;
   
        const renderView = () => {
            if(!activeTab) return null;
            switch(activeTab) {
                case activeViews.history:
                    return <HistoryTable activeTab={activeTab} />
                default:
                    return <DefaultTable activeTab={activeTab} />
            }
        }

        return (
            <Container className="arbitrage-tables-component">
                <TabsForm 
                    id="table"
                    tabs={arbitrageConfig.tablesInfo[activeView].tabs} 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab)}
                >
                    {renderView()}
                </TabsForm>
            </Container>
        )
    }, [activeTab, activeView]);
}

const DataView = () => {
    const isTablet = useIsTablet();
    return useMemo(() => {
        return isTablet ? <ExpandList /> : <Table />
    }, [isTablet]);
}

const DefaultTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    const [lastBlockTime, setLastBlockTime] = useState();
    const { unfulfilledRequests } = useSelector(({wallet}) => wallet);
    const activeToken = useActiveToken()
    const { library } = useWeb3React(config.web3ProviderId);

    useEffect(() => {
        const latestBlockTimestamp = async () => {
            try {
                const latestBlockTime = await getLatestBlockTimestamp(library.eth.getBlock);
                setLastBlockTime(latestBlockTime);
            } catch (error) {
                console.log(error)
            }
        }
        if (!lastBlockTime) {
            latestBlockTimestamp()
        }
    }, [library, unfulfilledRequests, activeTab, lastBlockTime])



    return useMemo(() => {
        const tableHeaders = arbitrageConfig.tables[activeView][activeTab].headers;
        const data = unfulfilledRequests ? unfulfilledRequests.map(({
            event, id, requestId, requestType, submitFeesAmount, targetTimestamp, timestamp, tokenAmount,
        }) => {
            const MAX_UPFRONT_FEE = toBN("500");
            const requestTypeLabel = arbitrageConfig.requestType[requestType];
            const eventTokenProperties = activeToken[`${requestTypeLabel}Properties`];
            const timeDelayFeeAmount = toBN(tokenAmount).sub(toBN(toBN(tokenAmount).sub(toBN(submitFeesAmount))));
            const maxFeeAmount = toBN(tokenAmount).div(toBN(MAX_PERCENTAGE)).mul(MAX_UPFRONT_FEE);
            const advanceAmount = toBN(maxFeeAmount).add(toBN(timeDelayFeeAmount));
            
            return {
                event,
                id,
                requestId,
                type: requestTypeLabel,
                amount: toDisplayAmount(tokenAmount, eventTokenProperties?.decimals),
                symbol: eventTokenProperties?.label.toUpperCase(),
                submitTime: timestamp,
                submitTimeToFulfillment: {
                    text: moment(targetTimestamp * 1000).format("HH:mm"),
                    subText: "HH:MM"
                },
                timeToFulfillmentFee: submitFeesAmount,
                upfrontPayment: toDisplayAmount(advanceAmount, eventTokenProperties.decimals),
                estimatedNumberOfTokens: customFixed(toDisplayAmount(tokenAmount*1000, eventTokenProperties.decimals), eventTokenProperties.customFixed),
                fulfillmentIn: targetTimestamp,
                action: true,
                lastBlockTime : lastBlockTime
            }
        }) : null;

        const checkLockTime = (time) => {
           const submitTimePlus = moment.utc(time * 1000).add(15, 'minutes');
           const duration = moment.duration(submitTimePlus.diff(moment.utc(lastBlockTime * 1000)))
           const miliSecDiff = duration.valueOf()
           return miliSecDiff > 0;
        }
        
        let filteredLockedTimestamps = []
        unfulfilledRequests?.filter(item => checkLockTime(item.timestamp))
        .map(filteredLockedTimestamps => (
            filteredLockedTimestamps.push(
                moment.duration(moment.utc(filteredLockedTimestamps.timestamp * 1000).add(15, 'minutes').diff(moment.utc(lastBlockTime * 1000))).valueOf()
            )
        ))
          console.log("filteredLockedTimestamps ", filteredLockedTimestamps.sort())

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={data}
            showPaginator
            customTableHeaders={!tableHeaders ? [] : Object.values(tableHeaders)}
        >
           <DataView />
        </DataController>
    }, [activeTab, activeToken, unfulfilledRequests, lastBlockTime]) // eslint-disable-line
}

const HistoryTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    const { arbitrage } = useSelector(({wallet}) => wallet);
    const activeToken = useActiveToken();

    return useMemo(() => {
        const tableHeaders = arbitrageConfig.tables[activeView][activeTab].headers;
        //TODO: add more details to history mapping
        const historyData = arbitrage ? arbitrage.map(({
            event, tokenAmount, mintedShortTokens
        }) => {

            
        const eventTokenProperties = activeToken[`${arbitrageConfig.requestType[event].toLowerCase()}Properties`];
        
        return {
            type: upperFirst(arbitrageConfig.requestType[event]),
            amount: `${customFixed(toDisplayAmount(tokenAmount, eventTokenProperties.decimals), eventTokenProperties.customFixed)} ${eventTokenProperties.label.toUpperCase()}`,
            timeToFulfillmentFee: Date.now() + 10000000,
            collateralMint: mintedShortTokens ? customFixed(toDisplayAmount(mintedShortTokens, eventTokenProperties.lpTokensDecimals), eventTokenProperties.customFixed) : 0,
            receivedTokens: eventTokenProperties?.label.toUpperCase(),
        }}) : null;

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={historyData}
            showPaginator
            customTableHeaders={!tableHeaders ? [] : Object.values(tableHeaders)}
        >
            <DataView />
        </DataController>
    }, [activeTab, activeToken, arbitrage]); // eslint-disable-line
}


export default ArbitrageTables;