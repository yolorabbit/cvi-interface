import React from "react";
import Button from "components/Elements/Button";

export const Migrate = ({
  stepDetails,
  setCurrentStep,
  currentStep,
  setIsProcessing,
  isProcessing,
}) => {
  const onClickHandler = ({ target: { id } }) => {
    setIsProcessing(true);
    setTimeout(() => {
      setCurrentStep(id === "migrate-a" ? "migrate-b" : "earn");
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
      </div>
      <div className="actions-wrapper">
        <Button
          id="migrate-a"
          className={`button step-button${
          currentStep === "migrate-a" ? "" : " disabled" }`}
          buttonText={stepDetails.stepButton[0]}
          disabled={currentStep !== "migrate-a"}
          processing={currentStep === "migrate-a" && isProcessing}
          onClick={onClickHandler} />
        <Button
          id="migrate-b"
          className={`button step-button${
          currentStep === "migrate-b" ? "" : " disabled" }`}
          buttonText={stepDetails.stepButton[1]}
          disabled={currentStep !== "migrate-b"}
          processing={currentStep === "migrate-b" && isProcessing}
          onClick={onClickHandler}/>
      </div>
    </div>
  );
};

export default Migrate;
