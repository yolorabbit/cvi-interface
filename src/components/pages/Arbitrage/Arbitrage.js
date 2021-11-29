import React, { useState, useMemo } from "react";
import { appViewContext, viewContext } from "components/Context";
import SubNavbar from "components/SubNavbar";
import Layout from "components/Layout/Layout";
import Row from "components/Layout/Row";
import arbitrageConfig from "config/arbitrageConfig";
import ArbitrageTables from "./ArbitrageTables/ArbitrageTables";
import config from "config/config";
import ActiveSection from "./ActiveSection";
import MainSection from "components/MainSection";
import useCvi from 'components/Hooks/Cvi';
import Statistics from "./Statistics";
import { useActiveToken, useW3SDK } from "components/Hooks";
import "./Arbitrage.scss";
import useArbitrageEvents from "components/Hooks/useArbitrageEvents";

const Arbitrage = () => {
  useCvi();
  const [activeView, setActiveView] = useState();
  const activeToken = useActiveToken(activeView);

  const w3Filters = activeToken?.rel ? {
    token: [activeToken.rel.volatilityToken]
  } : null;

  const w3 = useW3SDK(w3Filters);
  
  useArbitrageEvents(w3, activeToken);
  
  return useMemo(() => (
    <viewContext.Provider value={{w3}}>
      <div className="arbitrage-component">
        {/* <ArbitrageModal activeView={activeView}/> */}
        <SubNavbar
          tabs={Object.keys(arbitrageConfig.tabs["sub-navbar"])}
          activeView={activeView}
          setActiveView={setActiveView} 
          />

        <appViewContext.Provider value={{ activeView }}>
          <Layout>
            <Row className="statistics-row-component">
              <Statistics />
            </Row>

            <Row flex="100%">
              <MainSection path={config.routes.arbitrage.path}>
                <ActiveSection />
              </MainSection>
            </Row>

            <Row>
              <ArbitrageTables />
            </Row>
          </Layout>
        </appViewContext.Provider>
      </div>
    </viewContext.Provider>
  ), [activeView, w3]);
};

export default Arbitrage;
