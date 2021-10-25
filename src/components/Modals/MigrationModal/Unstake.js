import React from "react";
import Button from "components/Elements/Button";

export const Unstake = ({ stepDetails, setCurrentStep, userStakeAmount, setIsProcessing, isProcessing }) => {

  const onClickHandler = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCurrentStep("migrate-a");
      setIsProcessing(false);
    }, 3000);
  };

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
          processing={isProcessing}
          onClick={onClickHandler} />
      </div>
    </div>
  );
};

export default Unstake;
