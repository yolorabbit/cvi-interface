import { viewportContext } from 'components/Context';
import CviIndexGraph from 'components/CviIndexGraph';
import FundingFeesGraph from 'components/FundingFeesGraph';
import platformConfig from 'config/platformConfig';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Graphs.scss';

const Graphs = ({tabs = ["cvi index", "funding fee"]}) => {
    const tabsFormRef = useRef();
    const isSingleGraph = tabs.length === 1;
    const [activeTab, setActiveTab] = useState(isSingleGraph ? tabs[0] : undefined);
    const { width } = useContext(viewportContext);
    const [tabsFormWidth, setTabsFormWidth] = useState();
    const [tabsFormHeight, setTabsFormHeight] = useState();

    useEffect(() => {
        if(!width || !tabsFormRef.current) return;
        setTabsFormWidth(tabsFormRef.current.clientWidth);
        setTabsFormHeight(width > 1365 ? (width * 0.213) : width > 767 ? tabsFormRef.current.clientHeight - 50 : tabsFormRef.current.clientHeight - 150);
    }, [width]);

    return useMemo(() => {
        return (
            <Container className={`graphs-component single-graph`}>
                {isSingleGraph ? <div className="single-graph__container" ref={tabsFormRef}> 
                    <ActiveGraph activeTab={activeTab} tabsFormHeight={tabsFormHeight} tabsFormWidth={tabsFormWidth} width={width} />
                </div> : <TabsForm 
                        ref={tabsFormRef}
                        id="graph"
                        tabs={tabs} 
                        activeTab={activeTab} 
                        setActiveTab={(tab) => setActiveTab(tab)}>
                            <ActiveGraph activeTab={activeTab} tabsFormHeight={tabsFormHeight} tabsFormWidth={tabsFormWidth} width={width} />
                    </TabsForm>
                }
            </Container>
        )
    }, [isSingleGraph, activeTab, tabsFormHeight, tabsFormWidth, width, tabs])
}

const ActiveGraph = ({activeTab, tabsFormHeight, tabsFormWidth, width}) => {
    return useMemo(() => {
        return activeTab === platformConfig.tabs.graphs['cvi index']?.toLowerCase() ? 
            <CviIndexGraph    
                key={width}  
                maxWidth={tabsFormWidth ?? 400} 
                maxHeight={tabsFormHeight ?? 400}  
            /> :  
            <FundingFeesGraph 
                key={width} 
                maxWidth={tabsFormWidth ?? 400} 
                maxHeight={tabsFormHeight ?? 400} 
            />
    }, [activeTab, tabsFormHeight, tabsFormWidth, width]);
}

export default Graphs;