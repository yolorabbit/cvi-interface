import React, { useMemo, useState } from 'react'
import Button from '../Elements/Button';
import './Tabs.scss';
import config from '../../config/config';

const Tabs = ({type, isDropdown, tabs, activeTab, setActiveTab}) => {
    const [isOpen, setIsOpen] = useState();

    const formattedTabs = useMemo(
        () => Object.values(config.tabs).reduce((a, b) => ({...a, ...b})), 
    []);

    const onTabChange = (tab) => {
        setActiveTab(tab);
    }

    const onClickDropdown = () => {
        if(!isDropdown) return;
        setIsOpen(!isOpen);
    }

    return (
        <div className={`tabs-component ${type ?? ''}`} onClick={() => onClickDropdown()}>
            {isDropdown ? <div className={`tabs-component__dropdown ${isOpen ? 'is-open' : ''}`}> 
                <div className="tabs-component__dropdown--header">
                    <span className={`tabs-component__tab`}>{formattedTabs[activeTab] ?? activeTab}</span>
                    <img src={require('../../images/icons/dropdown-chevron.svg').default} alt="chevron" />
                </div>

                {isOpen && <div className="tabs-component__dropdown--options">
                    {tabs.map((tab, index) => <Button 
                        key={tab} 
                        className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} 
                        buttonText={formattedTabs[tab] ?? tab} 
                        onClick={() => onTabChange(tabs[index])} 
                    />)}
                </div>}
            </div> : <> 
                {tabs.map((tab, index) => <Button key={tab} className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} buttonText={formattedTabs[tab] ?? tab} onClick={() => onTabChange(tabs[index])}/>)}
            </>}
        </div>
    )
}

export default Tabs;