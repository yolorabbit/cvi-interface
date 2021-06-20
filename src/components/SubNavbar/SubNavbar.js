import React from 'react'
import './SubNavbar.scss';
import TabsForm from '../TabsForm';
import { useIsDesktop } from '../hooks';

const SubNavbar = ({tabs, setActiveView, activeView}) => {
    const isDesktop = useIsDesktop();
    return (
        <div className="sub-navbar-component">
            <TabsForm 
                id="view"
                className="sub-navbar"
                isDropdown={!isDesktop}
                tabs={tabs} 
                activeTab={activeView}
                setActiveTab={(tab) => setActiveView(tab)}
            />
        </div>
    )
}

export default SubNavbar;