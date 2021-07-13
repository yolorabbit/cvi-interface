import React, { useContext, useMemo, useState } from 'react';
import { platformViewContext } from '../../../Context';
import { useIsTablet } from 'components/Hooks';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import platformConfig, { activeViews } from 'config/platformConfig';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import './PlatformTables.scss';
import DataController from 'components/Tables/DataController';
import { useSelector } from 'react-redux';

const PlatformTables = () => {
    const { activeView } = useContext(platformViewContext);
    const [activeTab, setActiveTab] = useState();

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
        <Container className="platform-tables-component">
            <TabsForm 
                id="table"
                tabs={Object.values(platformConfig.tabs[activeView ?? 'trade'] ?? [])} 
                activeTab={activeTab} 
                setActiveTab={(tab) => setActiveTab(tab)}
            >
                {renderView()}
            </TabsForm>
        </Container>
    )
}

const DefaultTable = ({activeTab}) => {
    const { selectedNetwork } = useSelector(({app}) => app);
    const isTablet = useIsTablet();
    
    return useMemo(() => {
        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={Object.values(platformConfig.tokens[selectedNetwork]).filter(token => !token.soon)}
        >
            {isTablet ? <ExpandList /> : <Table />}
        </DataController>
    }, [activeTab, selectedNetwork, isTablet])
}

const HistoryTable = ({activeTab}) => {
    const isTablet = useIsTablet();
    const { activeView } = useContext(platformViewContext);
    const wallet = useSelector(({wallet}) => wallet);
    
    const historyData = useMemo(() => {
        return wallet?.[activeView === activeViews["view-liquidity"] ? 'liquidities' : 'positions'];
    }, [activeView, wallet]);
    
    return useMemo(() => {
        return <DataController 
            authGuard
            activeTab={activeTab} 
            data={historyData}
            showPaginator
        >
            {isTablet ? <ExpandList /> : <Table />}
        </DataController>
    }, [activeTab, historyData, isTablet])
}

export default PlatformTables;