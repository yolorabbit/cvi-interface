import React, { useState, useMemo } from "react";
import { appViewContext } from "components/Context";
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
import { useActiveToken } from "components/Hooks";
import useArbitrageEvents from "components/Hooks/useArbitrageEvents";
import useCviSdk from "components/Hooks/CviSdk";
import "./Arbitrage.scss";

const Arbitrage = () => {
  useCvi();
  const [activeView, setActiveView] = useState();
  const [activeTokenKey, setActiveTokenKey] = useState();
  const activeToken = useActiveToken(activeTokenKey, config.routes.arbitrage.path);
  
  const w3Filters = useMemo(() => activeToken?.rel ? {
    token: [activeToken.rel.volTokenKey]
  } : null, [activeToken?.rel])

  const w3 = useCviSdk(w3Filters);
  useArbitrageEvents(w3, activeToken);
  
  return useMemo(() => (
    <div className="arbitrage-component">
      <SubNavbar
        tabs={Object.keys(arbitrageConfig.tabs["sub-navbar"])}
        activeView={activeView}
        setActiveView={setActiveView} 
      />

      <appViewContext.Provider value={{ activeView, w3, activeToken, w3Filters }}>
        <Layout>
          <Row className="statistics-row-component">
            <Statistics />
          </Row>

          <Row flex="100%">
            <MainSection path={config.routes.arbitrage.path} cb={(tab) => setActiveTokenKey(tab)}>
              <ActiveSection />
            </MainSection>
          </Row>

          <Row>
            <ArbitrageTables />
          </Row>
        </Layout>
      </appViewContext.Provider>
    </div>
  ), [activeToken, activeView, w3, w3Filters]);
};

export default Arbitrage;
