import React, { useMemo } from 'react'
import Button from '../Elements/Button';
import './Tabs.scss';
import config from '../../config/config';


const Tabs = ({type, tabs, activeTab, setActiveTab}) => {
    const formattedTabs = useMemo(
        () => Object.values(config.tabs).reduce((a, b) => ({...a, ...b})), 
    []);

    const onTabChange = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div className={`tabs-component ${type ?? ''}`}>
            {tabs.map((tab, index) => <Button key={tab} className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} buttonText={formattedTabs[tab] ?? tab} onClick={() => onTabChange(tabs[index])}/>)}
        </div>
    )
}

export default Tabs;