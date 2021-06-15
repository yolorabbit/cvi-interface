import React from 'react'
import Button from '../Elements/Button';
import './Tabs.scss';

const Tabs = ({tabs, activeTab, setActiveTab}) => {
    const onTabChange = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div className="tabs-component">
            {tabs.map((tab, index) => <Button key={tab} className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} buttonText={tab} onClick={() => onTabChange(tabs[index])}/>)}
        </div>
    )
}

export default Tabs;