import React from "react";
import Button from "components/Elements/Button";

export const Migrate = ({
  stepDetails: {stepButton = [], stepDesc} = {},
  usdtLPBalance,
  onClickHandler,
  isLoading,
  disabled,
}) => {

  return (
    <div className="migration-step-wrapper">
      <div className="step-details">
        {stepDesc?.map((stepDesc, tn) => {
          if (stepDesc instanceof Array) {
            return <p key={tn}>{stepDesc[0]} {usdtLPBalance} USDT</p>; {/* TODO : CHANGE LP BALANCE */}
          }
          return <p key={tn}>{stepDesc}</p>;
        })}
      </div>
      <div className="actions-wrapper">
        {stepButton.map(step => 
          <Button
            key={step}
            id={step}
            className="button step-button"
            buttonText={step}
            onClick={() => onClickHandler(step.toLowerCase())} 
            processing={isLoading}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

export default Migrate;
