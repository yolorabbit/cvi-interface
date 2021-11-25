import React, { useState, useMemo } from "react";
import { appViewContext } from 'components/Context';
import SubNavbar from "components/SubNavbar";
import Layout from 'components/Layout/Layout';
import Row from 'components/Layout/Row';
import arbitrageConfig from "config/arbitrageConfig";
import Container from "components/Layout/Container";
import ArbitrageTables from './ArbitrageTables/ArbitrageTables';
import "./Arbitrage.scss";
import Dropdown from "components/Dropdown";

const Arbitrage = () => {
  const [activeView, setActiveView] = useState();

  return useMemo(() => {
    return (
        <div className="arbitrage-component">
            <SubNavbar 
                tabs={Object.keys(arbitrageConfig.tabs["sub-navbar"])} 
                activeView={activeView} 
                setActiveView={setActiveView} />
            
            <appViewContext.Provider value={{activeView}}>
                <Layout>
                    <Row className="statistics-row-component">
                        <Container>

                        </Container>
                    </Row>

                    <Row flex="100%">
                        <div>
                            <h2>Time to fulfillment</h2>
                            <span>(between 1 to 3 hours)</span>
                            <Dropdown label="hours" dropdownOptions={[1, 2, 3]} initialValue={3} type="number" />
                            <Dropdown label="minutes" dropdownOptions={Array.from(Array(60).keys())} initialValue={0} type="number" />
                            <Dropdown label="yovel" dropdownOptions={["option 1", "option 2", "option 3"]} initialValue={"hello"} type="text" />
                        </div>
                    </Row>
                    <Row>
                        <ArbitrageTables />
                    </Row>
                </Layout>
            </appViewContext.Provider>
        </div>
      );
  }, [activeView]);
};

export default Arbitrage;
