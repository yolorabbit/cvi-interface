import React, { useState, useMemo, useEffect } from "react";
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
import "./Arbitrage.scss";
import { useDispatch, useSelector } from "react-redux";
import { setUnfulfilledRequests } from 'store/actions/wallet'
import { useActiveWeb3React } from "components/Hooks/wallet";
import { useW3SDK } from "components/Hooks";

const LONG_TOKEN = {
  ETHVOL_USDC_LONG: "ETHVOL-USDC-LONG"
}

const Arbitrage = () => {
  const [activeView, setActiveView] = useState();
  const [{unfulfilledRequests},events] = useSelector(({wallet, events}) => [wallet, events]);
  const { account } = useActiveWeb3React();
  const dispatch = useDispatch();
  useCvi();
  
  const w3 = useW3SDK({
    token: [LONG_TOKEN.ETHVOL_USDC_LONG]
  });
  
  useEffect(()=>{
    const fetchUnfulfilledRequests = async () => {
      const unfulfilledRequests = await w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG].getUnfulfilledRequests({account});
      dispatch(setUnfulfilledRequests(unfulfilledRequests))
    }
    if(!unfulfilledRequests && account && w3?.tokens) {
      fetchUnfulfilledRequests();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3?.tokens, account]);

  useEffect(()=>{
    const getUnfulfilledRequestsById = async (requestId, lastEvent) => {
      const lastRequest = await w3?.tokens[LONG_TOKEN.ETHVOL_USDC_LONG].getRequest(requestId);
      if(lastRequest) {
        const { owner, raw: { tokenAmount }, requestType, targetTimestamp, requestTimestamp } = lastRequest
        const eventData = {
          account: owner,
          event: "SubmitRequest",
          requestId,
          requestType,
          submitFeesAmount: lastEvent.submitFeesAmount,
          targetTimestamp,
          timestamp: requestTimestamp,
          tokenAmount
        }

        dispatch(setUnfulfilledRequests(eventData, true))
      }
    }
    const longTokenUnfulfilledEvents = events[LONG_TOKEN.ETHVOL_USDC_LONG]?.SubmitRequest.events;
    if(!!longTokenUnfulfilledEvents?.length) {
      const lastEvent = longTokenUnfulfilledEvents[longTokenUnfulfilledEvents.length-1];
      getUnfulfilledRequestsById(lastEvent.requestId, lastEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events[LONG_TOKEN.ETHVOL_USDC_LONG]?.SubmitRequest.events.length]);
  
  return useMemo(() => (
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
  ), [activeView]);
};

export default Arbitrage;
