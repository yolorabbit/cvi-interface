import React, { useState, useEffect } from "react";
import Button from "components/Elements/Button";
import MigrationModal from "components/Modals/MigrationModal";
import { useWeb3React } from "@web3-react/core";

const Migrate = ({ tokenName, amount }) => {
  const { account } = useWeb3React();
  const [isLogged, setIsLogged] = useState();
  const [migrationModalIsOpen, setMigrationModalIsOpen] = useState(false);
  const [userStakeAmount, setUerStakeAmount] = useState(0);
  const [isUserLiquidity, setIsUserLiquidity] = useState(null);
  const [currentStep, setCurrentStep] = useState("migration-welcome");
  // console.log("tt ", tokenName);
  // useEffect(() => {
  //   if(!account || isLogged) return;
  //   setIsLogged(true);
  //   setMigrationModalIsOpen(true);

  //   return () => {
  //     setIsLogged(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account]);

  const migrateClickHandler = () => {
    setMigrationModalIsOpen(true);
  };

  return (
    <div className="migrate-component">
      <div className="migrate-component__container">
        {/* @TODO: show button  */}
        {(tokenName === "cvi-usdt-lp" || tokenName === "usdt") && (
          <Button
            className="migrate-component__container--button"
            buttonText="Migrate"
            onClick={migrateClickHandler}
          />
        )}

        {migrationModalIsOpen && (
          <MigrationModal
            setModalIsOpen={setMigrationModalIsOpen}
            userStakeAmount={userStakeAmount}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
      </div>
    </div>
  );
};

export default Migrate;
