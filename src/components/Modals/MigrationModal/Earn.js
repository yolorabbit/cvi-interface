import React from "react";

export const Earn = ({ stepDetails }) => {

  return (
    <div className="migration-step-wrapper">
      <div className="step-details">
        {stepDetails.stepDesc &&
          stepDetails.stepDesc.map((stepDesc, tn) => (
            <p key={tn}>{stepDesc}</p>
          ))}
      </div>
      <div className="actions-wrapper"></div>
    </div>
  );
};

export default Earn;
