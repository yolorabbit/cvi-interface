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
import { useDispatch } from 'react-redux';
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
    const [fee] = useState(0.3)
    const [amountToFullfill] = useState(1700)
    const [recieveAmount] = useState(900)
    const [estimatedAmount] = useState(15)
    const dispatch = useDispatch();
    const onClick = async() => {
      try {
        const mintAction = collateralMint ? "fulfillCollateralizedMint" : "fulfillMint";
        await w3?.tokens[activeToken.rel.contractKey][mintAction](requestData.requestId, account);
        dispatch(addAlert({
          id: 'mint',
          eventName: "Mint - failed",
          alertType: config.alerts.types.FAILED,
          message: "Transaction failed!"
        }));
      } catch {
        dispatch(addAlert({
          id: 'mint',
          eventName: "Mint - failed",
          alertType: config.alerts.types.FAILED,
          message: "Transaction failed!"
        }));
      } finally {
        closeBtn();
      }
  
      // show success / fail alert;
    }

    useEffect(()=>{
      console.log(w3);
      console.log(requestData);
      console.log(activeToken);
      const preFulfill = async () => {
        const preFulfillRes = await w3?.tokens[activeToken.rel.contractKey].preFulfill(requestData.requestId)
        // const { fulfillFees, fulfillFeesPercent, receive } = preFulfillRes;
        setPreFulfillData(preFulfillRes)
      }
      if(w3?.tokens[activeToken.rel.contractKey]) preFulfill();
    },[w3, requestData, activeToken]);

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
            value={requestData.amount || "0"}
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
            value={preFulfillData?.fulfillFeesPercent.toString() || "0"}
            format={`${preFulfillData?.fulfillFeesPercent.toString() || "0"}%`}
          />
    
          <Stat
            title="Mint fee"
            className="large-value bold nomargin"
            value={fee || "0"}
            format={`${fee || "0"}%`}
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
    },[preFulfillData, collateralMint])
}

export default Mint
