import React, { useState, useMemo } from "react";
import { appViewContext } from "components/Context";
import SubNavbar from "components/SubNavbar";
import Layout from "components/Layout/Layout";
import Row from "components/Layout/Row";
import arbitrageConfig from "config/arbitrageConfig";
import Container from "components/Layout/Container";
import ArbitrageTables from "./ArbitrageTables/ArbitrageTables";
import config from "config/config";
import ActiveSection from "./ActiveSection";
import MainSection from "components/MainSection";
import useCvi from 'components/Hooks/Cvi';
import "./Arbitrage.scss";

const Arbitrage = () => {
  const [activeView, setActiveView] = useState();
  
  useCvi();

  return useMemo(() => (
    <div className="arbitrage-component">
      <SubNavbar
        tabs={Object.keys(arbitrageConfig.tabs["sub-navbar"])}
        activeView={activeView}
        setActiveView={setActiveView} />

      <appViewContext.Provider value={{ activeView }}>
        <Layout>
          <Row className="statistics-row-component">
            <Container></Container>
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
  ), [activeView]);
};

export default Arbitrage;
