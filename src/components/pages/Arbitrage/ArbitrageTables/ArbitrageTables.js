import { activeViews } from 'config/arbitrageConfig';
import React, { useMemo, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './ArbitrageTables.scss';

const ArbitrageTables = () => {
    const [activeTab, setActiveTab] = useState();
  
    return useMemo(() => {
        return (
            <Container className="arbitrage-tables-component">
                <TabsForm 
                    id="table"
                    tabs={Object.values(activeViews)} 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab)}
                >
                    <Container>
                      
                    </Container>
                </TabsForm>
            </Container>
        )
    }, [activeTab]);
}


export default ArbitrageTables;