import React, { useState } from "react";
import "./MigrationModal.scss";
import Modal from "components/Modal/Modal";
import Title from "components/Elements/Title";
import Steps from "./Steps";
import MigrationWelcome from "./MigrationWelcome";
import Unstake from "./Unstake";
import Migrate from "./Migrate";
import Earn from "./Earn";

export const MigrationModal = ({ setModalIsOpen, currentStep, setCurrentStep, userStakeAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);


  const migrationSteps = [
    {
      stepKey: ["migration-welcome"],
      stepVisibility: false,
      stepDesc: ["Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."],
      stepButton: ["Migrate"]
    }, {
      stepKey: ["unstake"],
      stepVisibility: true,
      stepTitle: "Unstake",
      stepDesc: ["Unstake your USDT LP tokens"],
      stepButton: ["Unstake"]
    }, {
      stepKey: ["migrate-a", "migrate-b"],
      stepVisibility: true,
      stepTitle: "Migrate",
      stepDesc: [
        <span className="bold">
          Clicking the migrate button will perform the following actions:
        </span>,
        "1. Withdraw USDT liquidity and recieve 100 USDT.",
        "2. Swap 100 USDT for 100 USDC.",
        "3. Deposit 100 USDC to USDC liquidity pool."
      ],
      stepButton: ["Approve", "Migrate"],
    }, {
      stepKey: ["earn"],
      stepVisibility: true,
      stepTitle: "Receive 200 GOVI",
      stepDesc: [
        <span className="bold float-left">Congratulations!</span>,
        " You have successfully completed the migration.",
        <span className="green bold float-left">200 GOVI</span>,
        " will be sent to the following address shortly:",
        <span className="wallet-address">
          0x230fa9084500f9E473371fc566c0F08223d92800
        </span>
      ]
    }
  ];

  return (
    <Modal className="migration-modal" closeIcon handleCloseModal={() => setModalIsOpen(false)}>

      
      {currentStep === "migration-welcome" ? (
        <MigrationWelcome stepDetails={migrationSteps[0]}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        userStakeAmount={userStakeAmount} />
      ) :
      <>
         <Title className="migration-title" color="white" text="Migrate USDT liquidity to USDC platform" />
         <Steps steps={migrationSteps} currentStep={currentStep} />
      </>
     }

      {currentStep === "unstake" && (
        <Unstake stepDetails={migrationSteps[1]}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          userStakeAmount={userStakeAmount} />
      )}

      {currentStep === "migrate-a" || currentStep === "migrate-b" ? (
        <Migrate stepDetails={migrationSteps[2]}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep} />
      ) : null }

      {currentStep === "earn" && <Earn stepDetails={migrationSteps[3]} />}

    </Modal>
  );
};

export default MigrationModal;
