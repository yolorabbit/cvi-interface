import { appViewContext } from 'components/Context';
import { useIsTablet } from 'components/Hooks';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import arbitrageConfig, { activeViews } from 'config/arbitrageConfig';
import React, { useContext, useMemo, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './ArbitrageTables.scss';

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

    return useMemo(() => {
        const filterAssets = [{
            token: "usdc",
            type: "Mint",
            amount: "100 USDC",
            submitTime: Date.now(),
            submitTimeToFulfillment: Date.now() + 5000000,
            timeToFulfillmentFee: "1.5 USDC",
            upfrontPayment: "95 USDC",
            estimatedNumberOfTokens: "0.911 ETHVI",
            fulfillmentIn: Date.now() + 10000000,
            action: true
        },
        {
            token: "usdc",
            type: "Mint",
            amount: "100 USDC",
            submitTime: Date.now(),
            submitTimeToFulfillment: Date.now() + 5000000,
            timeToFulfillmentFee: "1.5 USDC",
            upfrontPayment: "95 USDC",
            estimatedNumberOfTokens: "0.911 ETHVI",
            fulfillmentIn: Date.now() + 10000000,
            action: true
        }]

        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={filterAssets}
            customTableHeaders={Object.values(arbitrageConfig.tables[activeView][activeTab].headers)}
        >
           <DataView />
        </DataController>
    }, [activeTab, activeView])
}

const HistoryTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    // const wallet = useSelector(({wallet}) => wallet);
    
    // const historyData = useMemo(() => {
    //     return wallet?.[activeView === activeTabs.mint ? 'mints' : 'burns'];
    // }, [activeView, wallet]);

    return useMemo(() => {
        const historyData = [{
            type: "Mint",
            amount: "100 USDC",
            submitTime: Date.now(),
            submitTimeToFulfillment: Date.now() + 5000000,
            timeToFulfillmentFee: Date.now() + 10000000,
            estimatedNumberOfTokens: "0.911 ETHVI",
            fulfillmentIn: Date.now() + 10000000,
            collateralMint: "Yes",
            receivedTokens: "usdc",
        },
        {
            type: "Mint",
            amount: "100 USDC",
            submitTime: Date.now(),
            submitTimeToFulfillment: Date.now() + 5000000,
            timeToFulfillmentFee: Date.now() + 10000000,
            estimatedNumberOfTokens: "0.911 ETHVI",
            fulfillmentIn: Date.now() + 10000000,
            collateralMint: "Yes",
            receivedTokens: "usdc",
        }]
        
        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={historyData}
            showPaginator
            customTableHeaders={Object.values(arbitrageConfig.tables[activeView][activeTab].headers)}
        >
            <DataView />
        </DataController>
    }, [activeTab, activeView]);
}


export default ArbitrageTables;