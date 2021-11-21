import TabsForm from 'components/TabsForm'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { activeVolsSet } from 'utils';
import Form from '../Form';
import './IndexTabs.scss';

const IndexTabs = () => {
    const [activeTab, setActiveTab] = useState();
    const { selectedNetwork } = useSelector(({app}) => app);
    const activeVolsList = Object.keys(activeVolsSet(selectedNetwork));

    return (
        <TabsForm
            id="index"
            className="index-tabs-form-container"
            tabs={activeVolsList}
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab)}
        >
            <Form activeTab={activeTab} />
        </TabsForm>
    )
}

export default IndexTabs;