import React from "react";
import Button from "components/Elements/Button";

export const Migrate = ({ stepDetails, setMigrateStatus, migrateStatus }) => {
  console.log("Unstake ", stepDetails);

  const onClickHandler = (e) => {
    console.log(e.target.id);
    if (e.target.id === "migrate-a") {
      setMigrateStatus("migrate-b");
    }
    if (e.target.id === "migrate-b") {
      setMigrateStatus("earn");
    }
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
            migrateStatus === "migrate-a" ? "" : " disabled"
          }`}
          buttonText={stepDetails.stepButton[0]}
          disabled={migrateStatus === "migrate-a" ? false : true}
          onClick={onClickHandler}
        />
        <Button
        id="migrate-b"
          className={`button step-button${
            migrateStatus === "migrate-b" ? "" : " disabled"
          }`}
          buttonText={stepDetails.stepButton[1]}
          disabled={migrateStatus === "migrate-b" ? false : true}
          onClick={onClickHandler}
        />
      </div>
    </div>
  );
};

export default Migrate;
