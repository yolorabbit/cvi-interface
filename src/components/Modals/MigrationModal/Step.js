import React from "react";
import "./Step.scss";

export const Step = ({ stepData, stepNumber, isActive, isConfirmed }) => {

  return (
    <div className={`step-wrapper${isActive ? ' active' : ''}`}>
      <div className="circle">
        {stepNumber}
        {isConfirmed && <img className="step-confirmed-icon" src={require('../../../images/icons/confirmed-icon.svg').default} alt="confirmed" />}
        </div>
      <span className="step-title">{stepData.stepTitle}</span>
    </div>
  );
};

export default Step;