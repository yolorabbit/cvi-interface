import React, { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import Button from "components/Elements/Button";
import MigrationModal from "components/Modals/MigrationModal";

const Migrate = ({ tokenName,amount }) => {
  const [migrationModalIsOpen, setMigrationModalIsOpen] = useState(false);
  const [userStakeAmount, setUerStakeAmount] = useState(0);
  const [isUserLiquidity, setIsUserLiquidity] = useState(null);
  const [currentStep, setCurrentStep] = useState("migration-welcome");
  const { liquidities } = useSelector(({wallet}) => wallet);

  useEffect(() => {
    if (liquidities !== null) {
      setIsUserLiquidity(liquidities.length > 0)
      setMigrationModalIsOpen(liquidities.length > 0);
    }
  }, [liquidities]);

  const migrateClickHandler = () => {
    setMigrationModalIsOpen(true)
  };

  return (
    <div className="migrate-component">
      {true && tokenName === "usdt" &&
      <Button
      className="migrate-component__container--button"
      buttonText="Migrate"
      onClick={migrateClickHandler} />
      }
      
      {migrationModalIsOpen && (
        <MigrationModal
        setModalIsOpen={setMigrationModalIsOpen}
        userStakeAmount={userStakeAmount}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}/>
      )}
    </div>
  );
};

export default Migrate;
