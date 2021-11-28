import React, { useMemo, useState } from 'react'
import Title from "components/Elements/Title";
import Stat from "components/Stat";
import Button from "components/Elements/Button";
import Checkbox from "components/Checkbox";
import Tooltip from "components/Tooltip";
import CountdownComponent from "components/Countdown";

const Mint = ({ closeBtn }) => {
    const [collateralMint, setCollateralMint] = useState(false)
    
    const activeToken = "USDC";
    const [amount] = useState(1000)
    const [upFrontPayment] = useState(1000)
    const [fullfillmentIn] = useState(27280000)
    const [timeToFullfillment] = useState(6)
    const [fee] = useState(0.3)
    const [amountToFullfill] = useState(1700)
    const [recieveAmount] = useState(900)
    const [estimatedAmount] = useState(15)

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
              value={amount || "0"}
              _suffix={activeToken}
            />
      
            <Stat
              title="Up front payment"
              className="large-value bold"
              value={upFrontPayment || "0"}
              _suffix={activeToken}
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
              title="Mint fee"
              className="large-value bold nomargin"
              value={fee || "0"}
              format={`${fee || "0"}%`}
            />
      
            <Checkbox
              onClick={() => setCollateralMint(!collateralMint)}
              id="collateralMint"
              title="Collateral mint"
              checked={collateralMint}
              tooltip={<Tooltip type="question" left={30} maxWidth={400} minWidth={250} content={"Collateral Mint tooltip"} />}
              className="modal-checkbox"
            />
      
            <Stat
              title="Amount to fullfill"
              className="large-value bold"
              value={amountToFullfill || "0"}
              format={`${amountToFullfill || "0"}`}
              _suffix={activeToken}
            />
      
            <Stat
              title="You will receive"
              className="large-value bold green"
              value={recieveAmount || "0"}
              format={`${recieveAmount || "0"}`}
              _suffix={" ETHVI-USDC-LP"}
            />
      
            <Stat
              name="estimatedMinted"
              className="large-value bold green"
              value={estimatedAmount || "0"}
              format={`${estimatedAmount || "0"}`}
              _suffix={activeToken}
            />
      
            <p className="modal-note">
              Please note: you won't be able to withdraw your liquidity within the
              next 24 hours. <br/>
              You can stake your ETHVI-USDC LP tokens to earn GOVI
              rewards.
            </p>
      
            <Button
              className="button arbitrage-button"
              buttonText={"Fullfill"}
              processing={false}
              disabled={false}
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
    }, [amount,
      upFrontPayment,
      fullfillmentIn,
      timeToFullfillment,
      fee,
      collateralMint,
      amountToFullfill,
      recieveAmount,
      estimatedAmount,
      closeBtn])
}

export default Mint
