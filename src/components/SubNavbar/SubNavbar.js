import React from 'react'
import './SubNavbar.scss';
import TabsForm from '../TabsForm';

const SubNavbar = ({tabs, setActiveView, activeView}) => {
    
    return (
        <div className="sub-navbar-component">
            <TabsForm 
                id="view"
                className="sub-navbar"
                tabs={tabs} 
                activeTab={activeView}
                setActiveTab={(tab) => setActiveView(tab)}
            />
        </div>
    )
}

export default SubNavbar;