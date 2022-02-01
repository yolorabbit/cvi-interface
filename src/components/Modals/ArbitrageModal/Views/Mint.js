import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Title from "components/Elements/Title";
import Stat from "components/Stat";
import Button from "components/Elements/Button";
import Checkbox from "components/Checkbox";
import Tooltip from "components/Tooltip";
import { appViewContext } from 'components/Context';
import { useActiveToken } from 'components/Hooks';
import { toDisplayAmount } from '@coti-cvi/cvi-sdk';
import { commaFormatted, customFixed } from 'utils';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import config from 'config/config';
import FulfillmentInTimer from 'components/pages/Arbitrage/FulfillmentInTimer';
import { upperCase } from 'lodash';

const Mint = ({ closeBtn, requestData }) => { // @TODO: refactor mint & burn into one view 
  const dispatch = useDispatch();
  const { unfulfilledRequests } = useSelector(({wallet})=>wallet);
  const { w3 } = useContext(appViewContext);
  const {account} = useActiveWeb3React();
  const activeToken = useActiveToken();
  const [collateralMint, setCollateralMint] = useState(false);
  const [preFulfillData, setPreFulfillData] = useState(null);
  const [isProcessing, setIsProcessing] = useState();
  const originalRequest = unfulfilledRequests.find(r => r.requestId === requestData.requestId);
  const [errorMessage, setErrorMessage] = useState();

  const onClick = useCallback(async() => {
    try {
      setIsProcessing(true);
      const mintAction = collateralMint ? "fulfillCollateralizedMint" : "fulfillMint";
      await w3?.tokens[activeToken.rel.volTokenKey][mintAction](originalRequest, {account});
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
  }, [account, activeToken.rel.volTokenKey, closeBtn, collateralMint, dispatch, originalRequest, w3?.tokens]);

  useEffect(()=>{
    if(!originalRequest) return;
    setPreFulfillData(null);

    const preFulfill = async () => {
      try {
        const preFulfillAction = collateralMint ? "preFulfillCollateralizedMint" : "preFulfillMint";
        let preFulfillRes = await w3?.tokens[activeToken.rel.volTokenKey][preFulfillAction](originalRequest, { account });
        preFulfillRes.penaltyFeePercentWithTimeDelay = preFulfillRes.penaltyFeePercent + Number(requestData.timeToFulfillmentFee.replace('%', ''));
        setPreFulfillData(preFulfillRes);
      } catch (error) {
        console.log(error);
        if(error.message.toLowerCase().includes('not enough liquidity')) 
          setErrorMessage("There is not enough available liquidity to cover your position. Please use a collateral mint option or try again later.")
        else 
          setErrorMessage("Something went wrong, please try again later.");
        
        setPreFulfillData("N/A");
      }
    }

    if(w3?.tokens[activeToken.rel.volTokenKey] && originalRequest) preFulfill();
  },[w3, requestData, activeToken, originalRequest, closeBtn, collateralMint, account]);

  return useMemo(() => (
    <>
      <Title
        className="arbitrage-title"
        color="white"
        text={`Mint ${activeToken.name.toUpperCase()} tokens`} />

      <Stat
        title="Amount"
        className="bold amount"
        value={`${requestData.amount} ${requestData.symbol}` || "-"} />

      <Stat
        title="Up front payment"
        className="large-value bold"
        value={requestData.upfrontPayment || "0"}
        _suffix={requestData.symbol} />

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

      {preFulfillData === 'N/A' && errorMessage && !collateralMint &&<p className="no-liquidity-msg">{errorMessage}</p>}
      
      <Checkbox
        className="modal-checkbox" 
        onClick={() => setCollateralMint(!collateralMint)}
        title="Collateral mint"
        checked={collateralMint}
        tooltip={<Tooltip 
          type="question" 
          left="0" 
          mobileLeft={-40} 
          content={<span>
            The collateral mint option enables the user to mint {upperCase(activeToken.name)} tokens while providing liquidity to cover the value of the long {upperCase(activeToken.oracleId)} position that those minted {upperCase(activeToken.name)} tokens hold. The liquidity provided is displayed on the platform page under provide liquidity tab. By using collateral mint option user won't be subject to the premium fees.
            </span>} 
          maxWidth={400}
        />}
      />

      <Stat
        title="Time to fullfillment and penalty fees"
        className="large-value bold"
        value={preFulfillData === 'N/A' ? '' : preFulfillData}
        format={preFulfillData === 'N/A' ? 'N/A' :`${commaFormatted(customFixed(preFulfillData?.penaltyFeePercentWithTimeDelay.toString(), 4))}%`} />

      <Stat
        title="Mint fee"
        className="large-value bold"
        value={preFulfillData === 'N/A' ? '' : preFulfillData}
        format={preFulfillData === 'N/A' ? 'N/A' :`${commaFormatted(customFixed(preFulfillData?.openFeePercent.toString(), 4)) || "-"}%`} />

      <Stat
        name="estimateMint"
        className="large-value bold green"
        value={preFulfillData === 'N/A' ? '' : preFulfillData}
        format={preFulfillData === 'N/A' ? '' :`${customFixed(toDisplayAmount(preFulfillData?.receive.toString(), activeToken.decimals), 4) || "0"}`}
        _suffix={activeToken.name.toUpperCase()}
        hideTooltip 
        actEthvol={activeToken.oracleId === config.volatilityIndexKey.ethvi}
      />

      {collateralMint && <>
        <Stat
          className="large-value bold green no-title"
          value={preFulfillData}
          format={(!preFulfillData?.shortReceive || preFulfillData === 'N/A') ? 'N/A' : `${customFixed(toDisplayAmount(preFulfillData?.shortReceive?.toString(), activeToken.decimals), 4) || "0"}`}
          _suffix={`${activeToken.oracleId.toUpperCase()}-USDC-LP`} 
        />

        <p className="modal-note">
          Please note: you won't be able to withdraw your liquidity within the
          next 36 hours.<br />
          You can stake your {activeToken.oracleId.toUpperCase()}-USDC LP tokens to earn GOVI
          rewards.
        </p>
      </>}

      <Button
        className="button arbitrage-button"
        buttonText="Fulfill"
        disabled={isProcessing || !originalRequest || !preFulfillData || preFulfillData === "N/A"}
        processing={isProcessing}
        onClick={onClick} />

      <Button
        className="button secondary arbitrage-button"
        buttonText="Cancel"
        onClick={closeBtn} />
    </>
  ),[activeToken.name, activeToken.oracleId, activeToken.decimals, requestData.amount, requestData.symbol, requestData.upfrontPayment, requestData.amountToFulfill, requestData.fulfillmentIn, preFulfillData, errorMessage, collateralMint, isProcessing, originalRequest, onClick, closeBtn])
}

export default Mint