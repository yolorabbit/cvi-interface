import React, { useState } from "react";
import "./MigrationModal.scss";
import Modal from "components/Modal/Modal";
import Title from "components/Elements/Title";
import Steps from "./Steps";
import MigrationWelcome from "./MigrationWelcome";
import Unstake from "./Unstake";
import Migrate from "./Migrate";
import Earn from "./Earn";
import config from "config/config";

export const MigrationModal = ({ setModalIsOpen, currentStep, setCurrentStep, userStakeAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Modal className="migration-modal" closeIcon handleCloseModal={() => setModalIsOpen(false)}>
      {currentStep === "migration-welcome" ? (
        <MigrationWelcome 
          stepDetails={config.migrationSteps[0]}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep} />
      ) :
      <>
         <Title className="migration-title" color="white" text="Migrate USDT liquidity to USDC platform" />
         <Steps steps={config.migrationSteps} currentStep={currentStep} />
      </>
     }

      {currentStep === "unstake" && (
        <Unstake 
          stepDetails={config.migrationSteps[1]}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          userStakeAmount={userStakeAmount} />
      )}

      {currentStep === "migrate-a" || currentStep === "migrate-b" ? (
        <Migrate stepDetails={config.migrationSteps[2]}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep} />
      ) : null }

      {currentStep === "earn" && <Earn stepDetails={config.migrationSteps[3]} />}
    </Modal>
  );
};

export default MigrationModal;
