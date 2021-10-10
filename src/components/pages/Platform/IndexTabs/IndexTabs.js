import TabsForm from 'components/TabsForm'
import platformConfig from 'config/platformConfig';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Form from '../Form'
import './IndexTabs.scss';

const IndexTabs = () => {
    const [activeTab, setActiveTab] = useState();
    const { selectedNetwork } = useSelector(({app}) => app);
    
    return (
        <TabsForm
            id="index"
            className="index-tabs-form-container"
            tabs={Object.keys(platformConfig.tabs.index[selectedNetwork])}
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab)}
        >
            <Form activeTab={activeTab} />
        </TabsForm>
    )
}

export default IndexTabs;