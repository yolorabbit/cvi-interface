import React from "react";
import Button from "components/Elements/Button";

export const Unstake = ({ stepDetails, userStakeAmount, onClickHandler }) => {

  return (
    <div className="migration-step-wrapper">
      <div className="step-details">
        {stepDetails.stepDesc &&
          stepDetails.stepDesc.map((stepDesc, tn) => (
            <p key={tn}>{stepDesc}</p>
          ))}
        <div className="user-amount bold">
          <p>Amount</p>
          <p>{userStakeAmount} USDT LP </p>
        </div>
      </div>
      <div className="actions-wrapper">
        <Button
          className="button step-button"
          buttonText={stepDetails.stepButton[0]}
          onClick={onClickHandler} />
      </div>
    </div>
  );
};

export default Unstake;
