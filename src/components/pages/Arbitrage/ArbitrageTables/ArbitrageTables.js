import { appViewContext } from 'components/Context';
import { useIsTablet } from 'components/Hooks';
import useAssets from 'components/Hooks/useAssets';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import arbitrageConfig, { activeTabs, activeViews } from 'config/arbitrageConfig';
import React, { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
    const filterAssets = useAssets(activeTab);

    return useMemo(() => {
        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={filterAssets}
        >
           <DataView />
        </DataController>
    }, [activeTab, filterAssets])
}

const HistoryTable = ({activeTab}) => {
    const { activeView } = useContext(appViewContext);
    const wallet = useSelector(({wallet}) => wallet);
    
    const historyData = useMemo(() => {
        return wallet?.[activeView === activeTabs.mint ? 'mints' : 'burns'];
    }, [activeView, wallet]);
    
    return useMemo(() => {
        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={historyData}
            showPaginator
        >
            <DataView />
        </DataController>
    }, [activeTab, historyData]);
}


export default ArbitrageTables;