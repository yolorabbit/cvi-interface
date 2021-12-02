import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Title from "components/Elements/Title";
import Stat from "components/Stat";
import Button from "components/Elements/Button";
import Checkbox from "components/Checkbox";
import Tooltip from "components/Tooltip";
import CountdownComponent from "components/Countdown";
import { appViewContext } from 'components/Context';
import { useActiveToken } from 'components/Hooks';
import { toDisplayAmount } from '@coti-io/cvi-sdk';
import { customFixed } from 'utils';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import config from 'config/config';

const Mint = ({ closeBtn, requestData }) => { // @TODO: refactor mint & burn into one view 
  const dispatch = useDispatch();
  const { unfulfilledRequests } = useSelector(({wallet})=>wallet);
  const { w3 } = useContext(appViewContext);
  const {account} = useActiveWeb3React();
  const activeToken = useActiveToken();
  const [collateralMint, setCollateralMint] = useState(false);
  const [preFulfillData, setPreFulfillData] = useState(null);
  const [fullfillmentIn] = useState(10000);
  const [isProcessing, setIsProcessing] = useState();
  const originalRequest = unfulfilledRequests.find(r => r.requestId === requestData.requestId)
  
  const onClick = useCallback(async() => {
    try {
      setIsProcessing(true);
      const mintAction = collateralMint ? "fulfillCollateralizedMint" : "fulfillMint";
      await w3?.tokens[activeToken.rel.volTokenKey][mintAction](originalRequest.requestId, {account});
      dispatch(addAlert({
        id: 'mint',
        eventName: "Mint - success",
        alertType: config.alerts.types.CONFIRMED,
        message: "Transaction success!"
      }));
    } catch (error){
      console.log("fulfill mint error: ", error);
      dispatch(addAlert({
        id: 'mint',
        eventName: "Mint - failed",
        alertType: config.alerts.types.FAILED,
        message: "Transaction failed!"
      }));
    } finally {
      closeBtn();
      setIsProcessing(false);
    }
  }, [account, activeToken.rel.volTokenKey, closeBtn, collateralMint, dispatch, originalRequest.requestId, w3?.tokens]);

  useEffect(()=>{
    if(!originalRequest) return;
    setPreFulfillData(null);

    const preFulfill = async () => {
      try {
        const preFulfillAction = collateralMint ? "preFulfillCollateralizedMint" : "preFulfillMint";
        const preFulfillRes = await w3?.tokens[activeToken.rel.volTokenKey][preFulfillAction](originalRequest);
        setPreFulfillData(preFulfillRes);
      } catch (error) {
        console.log(error);
        setPreFulfillData("N/A");
      }
    }

    if(w3?.tokens[activeToken.rel.volTokenKey] && originalRequest) preFulfill();
  },[w3, requestData, activeToken, originalRequest, closeBtn, collateralMint]);

  return useMemo(() => {
    return (
      <>
        <Title
          className="arbitrage-title"
          color="white"
          text={`Mint ETHVI tokens`}
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
          value={requestData.amount - requestData.upfrontPayment || "0"}
          _suffix={requestData.symbol}
        />

        <div className="stat-component">
          <h2>Fullfillment in</h2>
          <CountdownComponent
            lockedTime={fullfillmentIn}
            className={"fullfill-countdown"} 
          />
        </div>
  
        <Stat
          title="Time to fullfillment and penalty fees"
          className="large-value bold"
          value={preFulfillData}
          format={preFulfillData === 'N/A' ? 'N/A' : `${customFixed(preFulfillData?.penaltyFeePercent.toString(), 4)}%`}
        />
  
        <Stat
          title="Mint fee"
          className="large-value bold"
          value={preFulfillData}
          format={preFulfillData === 'N/A' ? 'N/A' : `${customFixed(preFulfillData?.openFeePercent.toString(), 4) || "-"}%`}
        />

        <Checkbox
          onClick={() => setCollateralMint(!collateralMint)}
          title="Collateral mint"
          checked={collateralMint}
          tooltip={<Tooltip type="question" left={30} maxWidth={400} minWidth={250} content={"Collateral Mint tooltip"} />}
          className="modal-checkbox"
        />
  
        {collateralMint && <> 
            <Stat
              title="You will receive"
              className="large-value bold green"
              value={preFulfillData}
              format={(!preFulfillData?.shortReceive || preFulfillData === 'N/A') ? 'N/A' : `${customFixed(toDisplayAmount(preFulfillData?.shortReceive?.toString(), activeToken.decimals), 4) || "0"}`}
              _suffix={"ETHVI-USDC-LP"}
            />
          </>
        }

        <Stat
          name="fulfillmentRequest"
          className="large-value bold green"
          value={preFulfillData}
          format={preFulfillData === 'N/A' ? 'N/A' : `${customFixed(toDisplayAmount(preFulfillData?.receive.toString(), activeToken.decimals), 4) || "0"}`}
          _suffix={`${activeToken.name.toUpperCase()} ≈`}
          hideTooltip
        />

        { collateralMint && 
          <p className="modal-note">
            Please note: you won't be able to withdraw your liquidity within the
            next 36 hours. <br/>
            You can stake your ETHVI-USDC LP tokens to earn GOVI
            rewards.
          </p> 
        }

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
  },[requestData, originalRequest, fullfillmentIn, preFulfillData, collateralMint, activeToken.decimals, activeToken.name, isProcessing, onClick, closeBtn])
}

export default Mint