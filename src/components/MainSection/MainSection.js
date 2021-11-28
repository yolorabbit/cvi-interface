import TabsForm from 'components/TabsForm'
import config from 'config/config';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { activeVolsSet } from 'utils';
import './MainSection.scss';

const MainSection = ({children, path = config.routes.platform.path}) => {
    const [activeTab, setActiveTab] = useState();
    const { selectedNetwork } = useSelector(({app}) => app);
    const activeVolsList = Object.keys(activeVolsSet(selectedNetwork, path));

    return (
        <TabsForm
            id="index"
            className="main-section-container"
            tabs={activeVolsList}
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab)}
        >
            {children && React.cloneElement(children, {activeTab: activeTab})}
        </TabsForm>
    )
}

export default MainSection;