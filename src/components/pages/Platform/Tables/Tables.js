import React, { useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Tables.scss';

const Tables = () => {
    const [activeTab, setActiveTab] = useState();

    return (
        <Container className="tables-component">
            <TabsForm 
                id="table"
                tabs={["positions", "history"]} 
                activeTab={activeTab} 
                setActiveTab={(tab) => setActiveTab(tab)}>
            
            </TabsForm>
        </Container>
    )
}

export default Tables;