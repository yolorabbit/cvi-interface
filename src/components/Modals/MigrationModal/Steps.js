import React from "react";
import "./Steps.scss";
import Step from "./Step";

export const Steps = ({ steps, currentStep }) => {


  var currentStepNumber = steps.findIndex(({ stepKey }) =>
    stepKey.some((key) => key === currentStep)
  );

  function checkActiveStep(snum) {
    if (snum <= currentStepNumber) {
      return true;
    } else return false;
  }

  function confirmedStep(snum) {
    if (snum < currentStepNumber || currentStepNumber === steps.length -1) {
      return true;
    } else return false;
  }

  return (
    <div className="steps-wrapper">
      <div className="steps-line" />
      {steps.length > 0 &&
        steps.map((step, snum) => {
          return (
            <Step
              key={snum}
              stepNumber={snum}
              stepData={step}
              currentStep={currentStep}
              isActive={checkActiveStep(snum)}
              isConfirmed={confirmedStep(snum)}
            />
          );
        })}
    </div>
  );
};

export default Steps;
