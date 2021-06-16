import React, { useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Graphs.scss';

const Graphs = () => {
    const [activeTab, setActiveTab] = useState();

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
}

export default Graphs;