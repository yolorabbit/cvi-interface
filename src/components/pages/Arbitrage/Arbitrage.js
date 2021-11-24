import React, { useState, useMemo } from "react";
import { appViewContext } from 'components/Context';
import SubNavbar from "components/SubNavbar";
import Column from 'components/Layout/Column';
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import arbitrageConfig from "config/arbitrageConfig";
import "./Arbitrage.scss";

const Arbitrage = () => {
  const [activeView, setActiveView] = useState();

  return useMemo(() => {
    return (
        <div className="arbitrage-component">
            <SubNavbar 
                tabs={Object.keys(arbitrageConfig.tabs["sub-navbar"])} 
                activeView={activeView} 
                setActiveView={setActiveView} 
            />
            
            <appViewContext.Provider value={{activeView}}>
                <Layout>
                    <Row className="statistics-row-component">
                        Index , Platform Value, Uniswap Value
                    </Row>

                    <Row flex="100%">
                        {/* Arbitrage tabs */}
                    </Row>

                    <Row>
                        {/* Arbitrage Tables */}
                    </Row>
                </Layout>
            </appViewContext.Provider>
        </div>
      );
  }, [activeView]);
};

export default Arbitrage;
