
import { useActiveToken, useIsTablet } from "components/Hooks";
import { appViewContext } from 'components/Context';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import arbitrageConfig, { activeViews } from 'config/arbitrageConfig';
import React, { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Container from 'components/Layout/Container';
import TabsForm from 'components/TabsForm';
import './ArbitrageTables.scss';
import moment from 'moment';
import { toDisplayAmount } from 'utils/index';

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
    const { unfulfilledRequests } = useSelector(({wallet}) => wallet);
    const activeToken = useActiveToken()

    return useMemo(() => {
        const tableHeaders = arbitrageConfig.tables[activeView][activeTab].headers;
        const data = unfulfilledRequests ? unfulfilledRequests.map(({
            event, id, requestId, requestType, submitFeesAmount, targetTimestamp, timestamp, tokenAmount,
        }) => ({
            event,
            id,
            requestId,
            type: arbitrageConfig.requestType[requestType],
            amount: toDisplayAmount(tokenAmount.toString(), activeToken.decimals),
            submitTime: timestamp,
            submitTimeToFulfillment: targetTimestamp,
            timeToFulfillmentFee: submitFeesAmount,
            upfrontPayment: '-',
            estimatedNumberOfTokens: '-',
            fulfillmentIn: targetTimestamp,
            action: true
        })) : null;

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={data}
            customTableHeaders={!tableHeaders ? [] : Object.values(tableHeaders)}
        >
           <DataView />
        </DataController>
    }, [activeTab, activeView, unfulfilledRequests])
}

const HistoryTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    const { arbitrage } = useSelector(({wallet}) => wallet);

    return useMemo(() => {
        const tableHeaders = arbitrageConfig.tables[activeView][activeTab].headers;

        //TODO: add more details to history mapping
        const historyData = arbitrage ? arbitrage.map((event)=>({
            type: event.event,
            amount: `${toDisplayAmount(event.tokenAmount, 6)} USDC`, //toDisplayAmount(tokenAmount, token.decimals) take token.decimal from arbitrageConfig
            submitTime: Date.now(),
            submitTimeToFulfillment: Date.now() + 5000000,
            timeToFulfillmentFee: Date.now() + 10000000,
            estimatedNumberOfTokens: "0.911 ETHVI",
            fulfillmentIn: moment(event.timestamp * 1000).format("DD/MM/YYYY"),
            collateralMint: "Yes",
            receivedTokens: "usdc",
        })) : null;

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={historyData}
            showPaginator
            customTableHeaders={!tableHeaders ? [] : Object.values(arbitrageConfig.tables[activeView][activeTab].headers)}
        >
            <DataView />
        </DataController>
    }, [activeTab, activeView, arbitrage]);
}


export default ArbitrageTables;