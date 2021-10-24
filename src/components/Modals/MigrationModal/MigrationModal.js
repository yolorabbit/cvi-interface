import React, { useState } from "react";
import "./MigrationModal.scss";
import Modal from "components/Modal/Modal";
import Title from "components/Elements/Title";
import Unstake from "./Unstake";
import Migrate from "./Migrate";
import Earn from "./Earn";
import Steps from "./Steps";

export const MigrationModal = ({ setModalIsOpen }) => {
  const [migrateStatus, setMigrateStatus] = useState("unstake");
  const migrationSteps = [
    {
      stepKey: ["unstake"],
      stepTitle: "Unstake",
      stepDesc: ["Unstake your USDT LP tokens"],
      stepButton: ["Unstake"],
    },
    {
      stepKey: ["migrate-a", "migrate-b"],
      stepTitle: "Migrate",
      stepDesc: [
        <strong>
          Clicking the migrate button will perform the following actions:
        </strong>,
        "1. Withdraw USDT liquidity and recieve 100 USDT.",
        "2. Swap 100 USDT for 100 USDC.",
        "3. Deposit 100 USDC to USDC liquidity pool.",
      ],
      stepButton: ["Approve", "Migrate"],
    },
    {
      stepKey: ["earn"],
      stepTitle: "Receive 200 GOVI",
      stepDesc: [
        <b className="float-left">Congratulations!</b>,
        " You have successfully completed the migration.",
        <span className="green bold float-left">200 GOVI</span>,
        " will be sent to the following address shortly:",
        <span className="wallet-address">0x230fa9084500f9E473371fc566c0F08223d92800</span>,
      ],
    },
  ];

  return (
    <Modal
      id="migration-modal"
      closeIcon
      handleCloseModal={() => setModalIsOpen(false)}
    >
      <Title
        className="migration-title"
        color="white"
        text="Migrate USDT liquidity to USDC platform"
      />

      <Steps steps={migrationSteps} currentStep={migrateStatus} />
      {migrateStatus === "unstake" && (
        <Unstake
          stepDetails={migrationSteps[0]}
          setMigrateStatus={setMigrateStatus}
          migrateStatus={migrateStatus}
        />
      )}
      {migrateStatus === "migrate-a" || migrateStatus === "migrate-b" ? (
        <Migrate
          stepDetails={migrationSteps[1]}
          setMigrateStatus={setMigrateStatus}
          migrateStatus={migrateStatus}
        />
      ) : null}
      {migrateStatus === "earn" && <Earn stepDetails={migrationSteps[2]} />}
    </Modal>
  );
};

export default MigrationModal;
