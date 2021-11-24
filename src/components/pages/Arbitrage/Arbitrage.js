import React, { useState, useMemo } from "react";
import { platformViewContext } from 'components/Context';
import SubNavbar from "components/SubNavbar";
import Statistics from './Statistics';
import Column from 'components/Layout/Column';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
// import Container from 'components/Layout/Container';
import arbitrageConfig from "config/arbitrageConfig";

import "./Arbitrage.scss";

const Arbitrage = () => {
  const [activeView, setActiveView] = useState();
  return useMemo(() => {
    return (
        <div className="arbitrage-component">
          <SubNavbar tabs={Object.keys(arbitrageConfig.tabs["sub-navbar"])} activeView={activeView} setActiveView={setActiveView} />
          <platformViewContext.Provider value={{activeView}}>
                        <Layout>
                            <Row className="statistics-row-component">
                                <Column>
                                    <Row>
                                        Index , Platform Value, Uniswap Value
                                    </Row>
                                </Column>
                            </Row>
                        </Layout>
            </platformViewContext.Provider>
        </div>
      );
  }, [activeView]);
};

export default Arbitrage;
