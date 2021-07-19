import React, { useEffect, useMemo, useState } from 'react'
import Button from '../Elements/Button';
import './Tabs.scss';
import platformConfig from 'config/platformConfig';
import { uniqueId } from 'lodash';
import { track } from 'shared/analytics';

const Tabs = ({enableOnly, type = "default", suffix = "", isDropdown, tabs, activeTab, setActiveTab}) => {
    const [isOpen, setIsOpen] = useState();
    
    const formattedTabs = useMemo(
        () => Object.values(platformConfig.tabs).reduce((a, b) => ({...a, ...b})), 
    []);

    useEffect(() => {
        if(tabs.includes(enableOnly)) {
            setActiveTab(enableOnly);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enableOnly, tabs]);

    const onTabChange = (tab) => {
        if(enableOnly === tab) return;
        setActiveTab(tab);
        track(`${tab} tab`);
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
                    {tabs?.filter(tab => tab !== activeTab)?.map((tab, index) => <Button 
                        key={uniqueId(tab)} 
                        className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} 
                        buttonText={formattedTabs[tab] ?? tab} 
                        onClick={() => onTabChange(tab)} 
                    />)}
                </div>}
            </div> : <> 
                {tabs.map((tab, index) => <Button
                     key={uniqueId(tab)} 
                     className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} 
                     buttonText={`${suffix}${formattedTabs[tab] ?? tab}`} 
                     disabled={enableOnly && enableOnly !== "0" && enableOnly !== tab}
                     onClick={() => onTabChange(tabs[index])}/>
                )}
            </>}
        </div>
    )
}

export default Tabs;