import React, { useContext, useState } from 'react';
import { platformViewContext } from '../../../Context';
import { useIsTablet } from 'components/hooks';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import platformConfig, { activeViews } from 'config/platformConfig';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import './PlatformTables.scss';

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

const PlatformTables = () => {
    const isTablet = useIsTablet();
    const { activeView } = useContext(platformViewContext);
    const [activeTab, setActiveTab] = useState();

    const renderView = () => {
        if(!activeTab) return null;
        const data = activeTab === activeViews.history ? historyData : Object.values(platformConfig.tokens);
        return isTablet ? <ExpandList activeTab={activeTab} data={data} /> : <Table activeTab={activeTab} data={data} />
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

export default PlatformTables;