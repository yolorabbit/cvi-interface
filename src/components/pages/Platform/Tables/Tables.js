import React, { useContext, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Tables.scss';
import config from '../../../../config/config';
import { platformViewContext } from '../../../Context';

const Tables = () => {
    const { activeView } = useContext(platformViewContext);
    const [activeTab, setActiveTab] = useState();

    return (
        <Container className="tables-component">
            <TabsForm 
                id="table"
                tabs={Object.values(config.tabs[activeView ?? 'trade'])} 
                activeTab={activeTab} 
                setActiveTab={(tab) => setActiveTab(tab)}>
            
            </TabsForm>
        </Container>
    )
}

export default Tables;