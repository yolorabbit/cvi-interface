import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Tabs from 'components/Tabs';
import { useInDOM } from 'components/hooks';
import './TabsForm.scss';

const TabsForm = ({tabs = [], dontChangeQuery, activeTab, setActiveTab, className, children}) => {
    const history = useHistory();
    const isActiveInDOM = useInDOM();
    
    useEffect(() => {
        if(activeTab && !dontChangeQuery) {
            const urlParams = new URLSearchParams(history.location?.search);
            urlParams.delete("view");
            urlParams.append("view", activeTab);
            history.push({search: urlParams.toString()});
        }
        //eslint-disable-next-line
    }, [activeTab]);

    useEffect(() => {
        if(isActiveInDOM()) {
            const viewParam = new URLSearchParams(history.location?.search).get('view');
            if(viewParam && tabs.some(tab => tab === viewParam)) {
                setActiveTab(viewParam);
            } else {
                setActiveTab(tabs[0]);
            }
        }
        //eslint-disable-next-line
    }, [location.search]);

    return ( 
        <>
            <div className={`tabs-form-component ${className ?? ''}`}>
                <div className="tabs-form-component__header">
                    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
                </div>

                <div className="tabs-form-component__container">
                    {children}
                </div>
            </div>
        </>
    )
}

export default TabsForm;