import { viewportContext } from 'components/Context';
import CviIndexGraph from 'components/CviIndexGraph';
import FundingFeesGraph from 'components/FundingFeesGraph';
import platformConfig from 'config/platformConfig';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Graphs.scss';

const Graphs = () => {
    const tabsFormRef = useRef();
    const [activeTab, setActiveTab] = useState();
    const { width } = useContext(viewportContext);
    const [tabsFormWidth, setTabsFormWidth] = useState();
    const [tabsFormHeight, setTabsFormHeight] = useState();

    useEffect(() => {
        if(!width) return;
        setTabsFormWidth(tabsFormRef.current.clientWidth);
        setTabsFormHeight(width > 1365 ? (width * 0.213) : width > 767 ? tabsFormRef.current.clientHeight - 50 : tabsFormRef.current.clientHeight - 150);
    }, [width]);

    return useMemo(() => {
        return (
            <Container className="graphs-component">
                <TabsForm 
                    ref={tabsFormRef}
                    id="graph"
                    tabs={["cvi index", "funding fee"]} 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab)}>
                        {activeTab === platformConfig.tabs.graphs['cvi index']?.toLowerCase() ? 
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
                        }
                </TabsForm>
            </Container>
        )
    }, [activeTab, width, tabsFormHeight, tabsFormWidth])
}

export default Graphs;