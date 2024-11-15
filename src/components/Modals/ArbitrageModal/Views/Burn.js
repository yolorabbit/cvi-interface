import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Title from "components/Elements/Title";
import Stat from "components/Stat";
import Button from "components/Elements/Button";
import { appViewContext } from 'components/Context';
import { useActiveToken } from 'components/Hooks';
import { toDisplayAmount } from '@coti-cvi/cvi-sdk';
import { commaFormatted, customFixed } from 'utils';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import config from 'config/config';
import FulfillmentInTimer from 'components/pages/Arbitrage/FulfillmentInTimer';

const Burn = ({ closeBtn, requestData }) => {
  const dispatch = useDispatch();
  const { unfulfilledRequests } = useSelector(({wallet})=>wallet);
  const { w3 } = useContext(appViewContext);
  const {account} = useActiveWeb3React();
  const activeToken = useActiveToken();
  const [preFulfillData, setPreFulfillData] = useState(null);
  const [isProcessing, setIsProcessing] = useState();
  const originalRequest = unfulfilledRequests.find(r => r.requestId === requestData.requestId)
  
  const onClick = useCallback(async() => {
    try {
      setIsProcessing(true);
      await w3?.tokens[activeToken.rel.volTokenKey].fulfillBurn(originalRequest, {account});
      dispatch(addAlert({
        id: 'burn',
        eventName: "Burn - success",
        alertType: config.alerts.types.CONFIRMED,
        message: "Transaction success!"
      }));
    } catch (error){
      console.log("fulfill burn error: ", error);
      dispatch(addAlert({
        id: 'burn',
        eventName: "Burn - failed",
        alertType: config.alerts.types.FAILED,
        message: "Transaction failed!"
      }));
    } finally {
      closeBtn();
      setIsProcessing(false);
    }
  }, [account, activeToken.rel.volTokenKey, closeBtn, dispatch, originalRequest, w3?.tokens]);

  useEffect(()=>{
    if(!originalRequest || !account) return;

    const preFulfill = async () => {
      try {
        const preFulfillRes = await w3?.tokens[activeToken.rel.volTokenKey].preFulfillBurn(originalRequest, { account });
        preFulfillRes.penaltyFeePercentWithTimeDelay = preFulfillRes.penaltyFeePercent + Number(requestData.timeToFulfillmentFee.replace('%', ''));
        setPreFulfillData(preFulfillRes);
      } catch (error) {
        console.log(error);
        setPreFulfillData("N/A");
      }
    }

    if(w3?.tokens[activeToken.rel.volTokenKey] && originalRequest) preFulfill();
  },[w3, requestData, activeToken, originalRequest, closeBtn, account]);

  return useMemo(() => {
    return (
      <>
        <Title
          className="arbitrage-title"
          color="white"
          text={`Burn ${activeToken.name.toUpperCase()} tokens`}
        />

        {(!requestData || !originalRequest || preFulfillData === "N/A") && <Stat title="Some error occurred." className="bold low" />}
  
        <Stat
          title="Amount"
          className="bold amount"
          value={`${requestData.amount} ${requestData.symbol}` || "-"}
        />
  
        <Stat
          title="Up front payment"
          className="large-value bold"
          value={requestData.upfrontPayment || "0"}
          _suffix={requestData.symbol}
        />

        <Stat
          title="Amount to fullfill"
          className="large-value bold"
          value={requestData.amountToFulfill || "0"}
          _suffix={requestData.symbol}
        />

        <div className="stat-component">
          <h2>Fullfillment in</h2>
           <FulfillmentInTimer fulfillmentIn={requestData.fulfillmentIn} />
        </div>
  
        <Stat
          title="Time to fullfillment and penalty fees"
          className="large-value bold"
          value={preFulfillData}
          format={preFulfillData === 'N/A' ? 'N/A' : `${commaFormatted(customFixed(preFulfillData?.penaltyFeePercentWithTimeDelay.toString(), 4))}%`}
        />
  
        <Stat
          title="Burn fee"
          className="large-value bold"
          value={preFulfillData}
          format={preFulfillData === 'N/A' ? 'N/A' : `${commaFormatted(customFixed(preFulfillData?.closeFeePercent.toString(), 4))}%`}
        />


        <Stat
          name="estimateBurn"
          className="large-value bold green"
          value={preFulfillData}
          format={preFulfillData === 'N/A' ? 'N/A' : `${customFixed(toDisplayAmount(preFulfillData?.receive.toString(), activeToken.pairToken.decimals), 4) || "0"}`}
          _suffix={activeToken.pairToken.name.toUpperCase()}
        />

        <Button
          className="button arbitrage-button"
          buttonText="Fullfill"
          disabled={isProcessing || !originalRequest || !preFulfillData || preFulfillData === "N/A"}
          processing={isProcessing}
          onClick={onClick}
        />

        <Button
          className="button secondary arbitrage-button"
          buttonText="Cancel"
          onClick={closeBtn}
        />
      </>
    )
  },[activeToken.name, activeToken.pairToken.decimals, activeToken.pairToken.name, requestData, originalRequest, preFulfillData, isProcessing, onClick, closeBtn])
}

export default Burn