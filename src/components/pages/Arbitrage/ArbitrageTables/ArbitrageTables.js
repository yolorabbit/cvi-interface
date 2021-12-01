
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
import { customFixed, toDisplayAmount } from 'utils/index';
import { upperFirst } from "lodash";

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
        }) => {
            
            const requestTypeLabel = arbitrageConfig.requestType[requestType];
            const eventTokenProperties = activeToken[`${requestTypeLabel}Properties`];

            return {
                event,
                id,
                requestId,
                type: requestTypeLabel,
                amount: toDisplayAmount(tokenAmount, eventTokenProperties?.decimals),
                symbol: eventTokenProperties?.label.toUpperCase(),
                submitTime: moment.unix(timestamp).format("DD/MM/YY HH:mm"),
                submitTimeToFulfillment: {
                    text: moment.unix(targetTimestamp).format("HH:mm"),
                    subText: "HH:MM"
                },
                timeToFulfillmentFee: submitFeesAmount,
                upfrontPayment: '-',
                estimatedNumberOfTokens: customFixed(toDisplayAmount(tokenAmount*1000, eventTokenProperties.decimals), eventTokenProperties.customFixed),
                fulfillmentIn: targetTimestamp,
                action: true
            }
        }) : null;

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={data}
            showPaginator
            customTableHeaders={!tableHeaders ? [] : Object.values(tableHeaders)}
        >
           <DataView />
        </DataController>
    }, [activeTab, activeToken, activeView, unfulfilledRequests])
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
            customTableHeaders={!tableHeaders ? [] : Object.values(arbitrageConfig.tables[activeView][activeTab].headers)}
        >
            <DataView />
        </DataController>
    }, [activeTab, activeView, activeToken, arbitrage]);
}


export default ArbitrageTables;