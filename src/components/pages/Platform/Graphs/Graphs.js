import React, { useMemo, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Graphs.scss';

const Graphs = () => {
    const [activeTab, setActiveTab] = useState();

    return useMemo(() => {
        return (
            <Container className="graphs-component">
                <TabsForm 
                    id="graph"
                    tabs={["cvi index", "funding fee"]} 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab)}>
                
                </TabsForm>
            </Container>
        )
    }, [activeTab])
}

export default Graphs;