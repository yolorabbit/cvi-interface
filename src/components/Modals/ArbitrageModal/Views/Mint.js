import React, { useContext, useEffect, useMemo, useState } from 'react'
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

const Mint = ({ closeBtn, requestData }) => {
  const [collateralMint, setCollateralMint] = useState(false);
  const {account} = useActiveWeb3React();
  const { w3 } = useContext(appViewContext);
  const activeToken = useActiveToken();
  const [upFrontPayment] = useState(1000)
  const [fullfillmentIn] = useState(27280000)
  const [preFulfillData, setPreFulfillData] = useState(null)
  const [amountToFullfill] = useState(1700)
  const dispatch = useDispatch();
  const { unfulfilledRequests } = useSelector(({wallet})=>wallet);
  const originalRequest = unfulfilledRequests.find(r => r.requestId === requestData.requestId)
  
  const onClick = async() => {
    try {
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
    }
  }

  useEffect(()=>{
    const preFulfill = async () => {
      const preFulfillRes = await w3?.tokens[activeToken.rel.volTokenKey].preFulfillMint(originalRequest)
      // const { fulfillFees, fulfillFeesPercent, receive } = preFulfillRes;
      console.log(preFulfillRes);
      setPreFulfillData(preFulfillRes)
    }
    if(w3?.tokens[activeToken.rel.volTokenKey] && originalRequest) preFulfill();
  },[w3, requestData, activeToken, originalRequest]);

  return useMemo(() => {

    return (
      <>
        <Title
          className="arbitrage-title"
          color="white"
          text={`Mint ETHVI tokens`}
        />
  
        <Stat
          title="Amount"
          className="bold amount"
          value={`${requestData.amount} ${requestData.symbol}` || "-"}
        />
  
        <Stat
          title="Up front payment"
          className="large-value bold"
          value={upFrontPayment || "0"}
          _suffix={activeToken.name}
        />
  
        <div className="stat-component">
          <h2 >
          Fullfillment in
          </h2>
          <CountdownComponent
          lockedTime={fullfillmentIn}
          className={"fullfill-countdown"} />
        </div>
  
        <Stat
          title="Time to fullfillment and penalty fees"
          className="large-value bold"
          value={preFulfillData?.penaltyFeePercent.toString() || "-"}
          format={`${preFulfillData?.penaltyFeePercent.toString() || "-"}%`}
        />
  
        <Stat
          title="Mint fee"
          className="large-value bold nomargin"
          value={preFulfillData?.openFeePercent.toString() || "-"}
          format={`${preFulfillData?.openFeePercent.toString() || "-"}%`}
        />
  
        <Checkbox
          onClick={() => setCollateralMint(!collateralMint)}
          title="Collateral mint"
          checked={collateralMint}
          tooltip={<Tooltip type="question" left={30} maxWidth={400} minWidth={250} content={"Collateral Mint tooltip"} />}
          className="modal-checkbox"
        />
  
        { collateralMint && <> 
            <Stat
              title="Amount to fullfill"
              className="large-value bold"
              value={amountToFullfill || "0"}
              format={`${amountToFullfill || "0"}`}
              _suffix={activeToken.name}
            />
      
            <Stat
              title="You will receive"
              className="large-value bold green"
              value={toDisplayAmount(preFulfillData?.receive.toString(), 0) || "0"}
              format={`${customFixed(toDisplayAmount(preFulfillData?.receive.toString(), 18), 4) || "0"}`}
              _suffix={" ETHVI-USDC-LP"}
            />
          </>
        }

        <Stat
          name="estimatedMinted"
          className="large-value bold green"
          value={toDisplayAmount(preFulfillData?.receive.toString(), 0) || "0"}
          format={`${customFixed(toDisplayAmount(preFulfillData?.receive.toString(), 18), 4) || "0"}`}
          _suffix={activeToken.name}
        />

        { collateralMint && 
          <p className="modal-note">
            Please note: you won't be able to withdraw your liquidity within the
            next 24 hours. <br/>
            You can stake your ETHVI-USDC LP tokens to earn GOVI
            rewards.
          </p> 
        }
        <Button
          className="button arbitrage-button"
          buttonText={"Fullfill"}
          processing={false}
          disabled={false}
          onClick={onClick}
        />
        <Button
          className="button secondary arbitrage-button"
          buttonText={"Cancel"}
          processing={false}
          disabled={false}
          onClick={closeBtn}
        />
      </>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[preFulfillData, collateralMint])
}

export default Mint