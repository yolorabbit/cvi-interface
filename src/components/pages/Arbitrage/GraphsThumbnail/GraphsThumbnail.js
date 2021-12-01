import { useIsMobile, useViewport } from "components/Hooks";
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useMemo, useRef, useState } from 'react';
import Container from 'components/Layout/Container';
import TabsForm from 'components/TabsForm';
import fulillmentGraph from 'images/graphs/fulfillment.svg';
import fulillmentGraphMobile from 'images/graphs/fulfillment-mobile.svg';
import fulillmentGraphTablet from 'images/graphs/fulfillment-tablet.svg';
import penaltyGraph from 'images/graphs/penalty.svg';
import penaltyGraphMobile from 'images/graphs/penalty-mobile.svg';
import penaltyGraphTablet from 'images/graphs/penalty-tablet.svg';
import './GraphsThumbnail.scss';

const GraphsThumbnail = () => {
    const tabs = useMemo(() => ({
      fulfillment: arbitrageConfig.tabs.graphs['fulfillment'],
      penalty: arbitrageConfig.tabs.graphs['penalty']
    }), []);
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
                  />
                </TabsForm>
            </Container>
        )
    }, [tabs, isMobile, activeTab])
}

const ActiveGraph = ({activeTab = ""}) => {
    const { width } = useViewport();

    return useMemo(() => {
        return (
            <div className="graph-wrapper">
              {activeTab.toLowerCase() === 'fulfillment' ? 
                <>
                  <img className="graph-image" src={width <= 767 ? fulillmentGraphMobile : width <= 1365 ? fulillmentGraphTablet : fulillmentGraph} alt="Time to fullfillment fee" />
                  <p className="graph-note">The fee decreases the more the user's time to fulfillment target gets closer to the 3 hours bound.</p>
                </>
                :
                <>
                  <img className="graph-image" src={width <= 767 ? penaltyGraphMobile : width <= 1365 ? penaltyGraphTablet : penaltyGraph} alt="Time penalty fee" />
                  <p className="graph-note">A time penalty fee is introduced if the user fulfills his request prior/after his specified target time.</p>
                </>
              }
            </div> 
        )
    }, [activeTab, width]);
}

export default GraphsThumbnail;

