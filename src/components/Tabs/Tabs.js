import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../Elements/Button';
import platformConfig from 'config/platformConfig';
import { uniqueId } from 'lodash';
import { track } from 'shared/analytics';
import config from 'config/config';
import './Tabs.scss';

const Tabs = ({enableOnly, type = "default", suffix = "", isDropdown, tabs, activeTab, setActiveTab}) => {
    const [isOpen, setIsOpen] = useState();
    const isArray = tabs instanceof Array;
    const _tabsKeys = isArray ? tabs : Object.keys(tabs);

    const formattedTabs = useMemo(
        () => Object.values(platformConfig.tabs).reduce((a, b) => ({...a, ...b})), 
    []);

    useEffect(() => {
        if(_tabsKeys.includes(enableOnly)) {
            setActiveTab(enableOnly);
        }
    }, [enableOnly, _tabsKeys, setActiveTab]);

    const onTabChange = useCallback((tab) => {
        if(enableOnly === tab) return;
        setActiveTab(tab);
        track(`${tab} tab`);
    }, [enableOnly, setActiveTab])

    const onClickDropdown = useCallback(() => {
        if(!isDropdown) return;
        setIsOpen(!isOpen);
    }, [isDropdown, isOpen])
   
    return useMemo(() => {
        const renderTabs = () => {
            return _tabsKeys.map((tab, index) => {
                const oracleLabel = config.volatilityKey[tab] ? `${tab.toUpperCase()} index` : undefined;
                const tabLabel = formattedTabs[tab] ?? oracleLabel ?? tab;
                return <Button
                    key={uniqueId(tab)} 
                    className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} 
                    buttonText={tabs?.[tab] ?? `${suffix}${tabLabel}`} 
                    disabled={enableOnly && enableOnly !== "0" && enableOnly !== tab}
                    onClick={() => onTabChange(_tabsKeys[index])} 
                />
            })
        }

        return (
            <div className={`tabs-component ${type ?? ''}`} onClick={() => onClickDropdown()}>
                {isDropdown ? <div className={`tabs-component__dropdown ${isOpen ? 'is-open' : ''}`}> 
                    <div className="tabs-component__dropdown--header">
                        <span className={`tabs-component__tab`}>{formattedTabs[activeTab] ?? tabs?.[activeTab] ?? activeTab}</span>
                        <img src={require('../../images/icons/dropdown-chevron.svg').default} alt="chevron" />
                    </div>
    
                    {isOpen && <div className="tabs-component__dropdown--options">
                        {_tabsKeys?.filter(tab => tab !== activeTab)?.map((tab, index) => <Button 
                            key={uniqueId(tab)} 
                            className={`tabs-component__tab ${(tab === activeTab || index === activeTab) ? 'active' : ''}`} 
                            buttonText={formattedTabs[tab] ?? tabs?.[tab] ?? tab} 
                            onClick={() => onTabChange(tab)} 
                        />)}
                    </div>}
                </div> : <> 
                    {renderTabs()}
                </>}
            </div>
        )
    }, [type, isDropdown, isOpen, formattedTabs, activeTab, tabs, _tabsKeys, suffix, enableOnly, onTabChange, onClickDropdown]);
}

export default Tabs;