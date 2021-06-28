import React, { useContext, useState } from 'react';
import { platformViewContext } from '../../../Context';
import { useIsTablet } from 'components/hooks';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import Table from './Table';
import ExpandList from './ExpandList';
import './Tables.scss';
import platformConfig from 'config/platformConfig';

const historyData = [{
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `1 ETH`,
    fees: `-`,
    netAmount: `-`
},{
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `1 ETH`,
    fees: `1`,
    netAmount: `76`
},{
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `1 ETH`,
    fees: `-`,
    netAmount: `-`
},{
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `1 ETH`,
    fees: `-`,
    netAmount: `-`
},{
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `5 ETH`,
    fees: `-`,
    netAmount: `-`
},{
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `2 ETH`,
    fees: `-`,
    netAmount: `-`
}];

const Tables = () => {
    const isTablet = useIsTablet();
    const { activeView } = useContext(platformViewContext);
    const [activeTab, setActiveTab] = useState();

    const renderView = () => {
        if(!activeTab) return null;

        switch(activeTab) {
            case "History": 
                return isTablet ? <ExpandList activeTab={activeTab} data={historyData} /> : <Table activeTab={activeTab} data={historyData} />

            default:
                return isTablet ? <ExpandList activeTab={activeTab} data={platformConfig.tokens} /> : <Table activeTab={activeTab} data={platformConfig.tokens} />
        }
    }

    return (
        <Container className="tables-component">
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

export default Tables;