import { viewportContext } from 'components/Context';
import CviIndexGraph from 'components/CviIndexGraph';
import FundingFeesGraph from 'components/FundingFeesGraph';
import platformConfig from 'config/platformConfig';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../../Layout/Container';
import TabsForm from '../../../TabsForm';
import './Graphs.scss';

const feesInfo = [[0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],[21,10],[22,10],[23,10],[24,10],[25,10],[26,10],[27,10],[28,10],[29,10],[30,10],[31,10],[32,10],[33,10],[34,10],[35,10],[36,10],[37,10],[38,10],[39,10],[40,10],[41,10],[42,10],[43,10],[44,10],[45,10],[46,10],[47,10],[48,10],[49,10],[50,10],[51,10],[52,10],[53,10],[54,10],[55,10],[56,10],[57,8.906],[58,7.779],[59,6.798],[60,5.943],[61,5.2],[62,4.553],[63,3.989],[64,3.499],[65,3.072],[66,2.7],[67,2.376],[68,2.095],[69,1.849],[70,1.636],[71,1.45],[72,1.288],[73,1.147],[74,1.025],[75,0.918],[76,0.825],[77,0.744],[78,0.674],[79,0.612],[80,0.559],[81,0.513],[82,0.472],[83,0.437],[84,0.406],[85,0.379],[86,0.356],[87,0.336],[88,0.318],[89,0.303],[90,0.29],[91,0.278],[92,0.268],[93,0.259],[94,0.252],[95,0.245],[96,0.239],[97,0.234],[98,0.23],[99,0.226],[100,0.222],[101,0.22],[102,0.217],[103,0.215],[104,0.213],[105,0.211],[106,0.21],[107,0.209],[108,0.207],[109,0.206],[110,0.206],[111,0.2],[112,0.2],[113,0.2],[114,0.2],[115,0.2],[116,0.2],[117,0.2],[118,0.2],[119,0.2],[120,0.2],[121,0.2],[122,0.2],[123,0.2],[124,0.2],[125,0.2],[126,0.2],[127,0.2],[128,0.2],[129,0.2],[130,0.2],[131,0.2],[132,0.2],[133,0.2],[134,0.2],[135,0.2],[136,0.2],[137,0.2],[138,0.2],[139,0.2],[140,0.2],[141,0.2],[142,0.2],[143,0.2],[144,0.2],[145,0.2],[146,0.2],[147,0.2],[148,0.2],[149,0.2],[150,0.2],[151,0.2],[152,0.2],[153,0.2],[154,0.2],[155,0.2],[156,0.2],[157,0.2],[158,0.2],[159,0.2],[160,0.2],[161,0.2],[162,0.2],[163,0.2],[164,0.2],[165,0.2],[166,0.2],[167,0.2],[168,0.2],[169,0.2],[170,0.2],[171,0.2],[172,0.2],[173,0.2],[174,0.2],[175,0.2],[176,0.2],[177,0.2],[178,0.2],[179,0.2],[180,0.2],[181,0.2],[182,0.2],[183,0.2],[184,0.2],[185,0.2],[186,0.2],[187,0.2],[188,0.2],[189,0.2],[190,0.2],[191,0.2],[192,0.2],[193,0.2],[194,0.2],[195,0.2],[196,0.2],[197,0.2],[198,0.2],[199,0.2],[200,0.2]];

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
                                series={[]} 
                            /> :  
                            <FundingFeesGraph 
                                key={width} 
                                series={feesInfo} 
                                cviValue={100} 
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