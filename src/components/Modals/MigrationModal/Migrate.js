import React from "react";
import Button from "components/Elements/Button";

export const Migrate = ({
  stepDetails: {stepButton = [], stepDesc} = {},
  onClickHandler
}) => {

  return (
    <div className="migration-step-wrapper">
      <div className="step-details">
        {stepDesc &&
          stepDesc.map((stepDesc, tn) => (
            <p key={tn}>{stepDesc}</p>
          ))}
      </div>
      <div className="actions-wrapper">
        {stepButton.map(step => 
          <Button
            key={step}
            id={step}
            className="button step-button"
            buttonText={step}
            onClick={() => onClickHandler(step.toLowerCase())} 
          />
        )}
      </div>
    </div>
  );
};

export default Migrate;
