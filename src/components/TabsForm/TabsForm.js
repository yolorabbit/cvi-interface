import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Tabs from 'components/Tabs';
import { useInDOM } from 'components/Hooks';
import './TabsForm.scss';
import { platformViewContext } from 'components/Context';

const TabsForm = React.forwardRef(({id = "view", tabs = [], isDropdown, dontChangeQuery, activeTab, setActiveTab, className, rightContent, children}, ref) => {
    const history = useHistory();
    const { activeView } = useContext(platformViewContext);
    const isActiveInDOM = useInDOM();
    
    useEffect(() => {
        if(activeTab && !dontChangeQuery) {
            const urlParams = new URLSearchParams(history.location?.search);
            urlParams.delete(id);
            urlParams.append(id, activeTab);
            history.push({search: urlParams.toString()});
        }
        //eslint-disable-next-line
    }, [activeTab]);

    useEffect(() => {
        if(isActiveInDOM()) {
            const viewParam = new URLSearchParams(history.location?.search).get(id);
            if(viewParam && tabs.some(tab => tab === viewParam)) {
                setActiveTab(viewParam);
            } else {
                setActiveTab(tabs[0]);
            }
        }
        //eslint-disable-next-line
    }, [history?.location, activeView]);

    return ( 
        <>
            <div ref={ref} className={`tabs-form-component ${className ?? ''}`}>
                <div className="tabs-form-component__header">
                    <Tabs isDropdown={isDropdown} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
                    {rightContent && <div className="tabs-form-component__header--right">
                        {rightContent}
                    </div>}
                </div>

                <div className="tabs-form-component__container">
                    {children}
                </div>
            </div>
        </>
    )
});

export default TabsForm;