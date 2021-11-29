import React, { useContext, useEffect, useMemo, useState } from 'react'
import Title from "components/Elements/Title";
import Stat from "components/Stat";
import Button from "components/Elements/Button";
import CountdownComponent from "components/Countdown";
import { useDispatch } from 'react-redux';
import { appViewContext } from 'components/Context';
import { useActiveToken } from 'components/Hooks';
import { addAlert } from 'store/actions';
import config from 'config/config';
import { useActiveWeb3React } from 'components/Hooks/wallet';

const Burn = ({ closeBtn, requestData }) => {
  const activeToken = useActiveToken();
  const { w3 } = useContext(appViewContext);
  const { account } = useActiveWeb3React();
  const [preFulfillData, setPreFulfillData] = useState(null)
  const [amount] = useState(100)
  const [upFrontPayment] = useState(1000)
  const [fullfillmentIn] = useState(17280000)
  const [timeToFullfillment] = useState(6)
  const [fee] = useState(0.3)
  const [amountToFullfill] = useState(1700)
  const [recieveAmount] = useState(900)
  const [estimatedAmount] = useState(15)
  const dispatch = useDispatch();
    
  const onClick = async() => {
    try {
      await w3?.tokens[activeToken.rel.contractKey].fulfillBurn(requestData.requestId, account);
      dispatch(addAlert({
        id: 'mint',
        eventName: "Mint - failed",
        alertType: config.alerts.types.CONFIRMED,
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
  }

  useEffect(()=>{
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
              text={`Burn ETHVI tokens`}
            />
      
            <Stat
              title="Amount"
              className="bold amount"
              value={amount || "0"}
              _suffix={activeToken.name}
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
              value={timeToFullfillment || "0"}
              format={`${timeToFullfillment || "0"}%`}
            />
      
            <Stat
              title="Burn fee"
              className="large-value bold"
              value={fee || "0"}
              format={`${fee || "0"}%`}
            />
      
            <Stat
              title="Amount to fullfill"
              className="large-value bold"
              value={amountToFullfill || "0"}
              format={`${amountToFullfill || "0"}`}
              _suffix={activeToken.name}
            />
      
            <Stat
              title="You will receive"
              className="large-value bold"
              value={recieveAmount || "0"}
              format={`${recieveAmount || "0"}`}
              _suffix={"ETHVI"}
            />
      
            <Stat
              name="estimatedBurn"
              className="large-value bold green"
              value={estimatedAmount || "0"}
              format={`${estimatedAmount || "0"}`}
              _suffix={activeToken.name}
            />
      
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
  // eslint-disable-next-line 
  }, [preFulfillData])
}

export default Burn
