import { appViewContext } from 'components/Context';
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useContext, useMemo, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './ArbitrageTables.scss';

const ArbitrageTables = () => {
    const [activeTab, setActiveTab] = useState();
    const { activeView } = useContext(appViewContext);

    return useMemo(() => {
        if(!activeView) return null;

        return (
            <Container className="arbitrage-tables-component">
                <TabsForm 
                    id="table"
                    tabs={arbitrageConfig.tablesInfo[activeView].tabs} 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab)}
                >
                    <Container>
                        {activeView}-{activeTab}
                    </Container>
                </TabsForm>
            </Container>
        )
    }, [activeTab, activeView]);
}


export default ArbitrageTables;