import React, { useContext, useState } from 'react';
import { platformViewContext } from '../../../Context';
import { useIsTablet } from 'components/hooks';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import config from '../../../../config/config';
import Table from './Table';
import List from 'components/List';
import './Tables.scss';

const Tables = () => {
    const isTablet = useIsTablet();
    const { activeView } = useContext(platformViewContext);
    const [activeTab, setActiveTab] = useState();

    const renderView = () => {
        switch(activeTab) {
            case config.tabs.trade.positions: {
                return isTablet ? <List /> : <Table activeTab={activeTab} />
            }

            case config.tabs['view-liquidity'].liquidity: {
                return isTablet ? <List /> : <Table activeTab={activeTab} />
            }

            case "History": 
                return <h2>History</h2>

            default:
                return null;
        }
    }

    return (
        <Container className="tables-component">
            <TabsForm 
                id="table"
                tabs={Object.values(config.tabs[activeView ?? 'trade'] ?? [])} 
                activeTab={activeTab} 
                setActiveTab={(tab) => setActiveTab(tab)}>
                    {renderView()}
            </TabsForm>
        </Container>
    )
}

export default Tables;