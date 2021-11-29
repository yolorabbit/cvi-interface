import { useIsMobile } from "components/Hooks";
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useMemo, useRef, useState } from 'react';
import Container from 'components/Layout/Container';
import TabsForm from 'components/TabsForm';
import fulillmentGraph from 'images/graphs/fulfilment.svg';
import fulillmentGraphMobile from 'images/graphs/fulfilment-mobile.svg';
import penaltyGraph from 'images/graphs/penalty.svg';
import penaltyGraphMobile from 'images/graphs/penalty-mobile.svg';
import './GraphsThumbnail.scss';

const GraphsThumbnail = ({tabs = [
  arbitrageConfig.tabs.graphs['fulfilment'],
  arbitrageConfig.tabs.graphs['penalty'
  ]]}) => {
    const tabsFormRef = useRef();
    const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0] : undefined);
    const isMobile = useIsMobile();

    return useMemo(() => {
        return (
            <Container className="graphs-thumbnail-component">
                <TabsForm 
                ref={tabsFormRef}
                className="arbitrage-graphs-tabs"
                id="graphs"
                tabs={tabs} 
                isDropdown={isMobile}
                activeTab={activeTab} 
                setActiveTab={(tab) => setActiveTab(tab)}
                >
                  <ActiveGraph 
                  activeTab={activeTab}
                  isMobile={isMobile} 
                  />
                </TabsForm>
            </Container>
        )
    }, [activeTab, tabs, isMobile])
}

const ActiveGraph = ({activeTab = "", isMobile}) => {
    return useMemo(() => {
        return (
            <div className="graph-wrapper">
              {activeTab.toLowerCase() === arbitrageConfig.tabs.graphs['fulfilment']?.toLowerCase() ? 
              <>
                <img className="graph-image" src={isMobile ? fulillmentGraphMobile : fulillmentGraph} alt="Time to fullfillment fee" />
                <p className="graph-note">The fee decreases the more the user's time to fulfillment target gets closer to the 3 hours bound.</p>
              </>
              :
              <>
                <img className="graph-image" src={isMobile ? penaltyGraphMobile : penaltyGraph} alt="Time penalty fee" />
                <p className="graph-note">A time penalty fee is introduced if the user fulfills his request prior/after his specified target time.</p>
              </>
            }
            </div> 
            )}, [activeTab, isMobile]);
}

export default GraphsThumbnail;

