import { useActiveWeb3React } from "components/Hooks/wallet";
import React from "react";

export const Earn = ({ stepDetails }) => {
  const { account } = useActiveWeb3React();

  return (
    <div className="migration-step-wrapper">
      <div className="step-details">
        {stepDetails.stepDesc &&
          stepDetails.stepDesc.map((stepDesc, tn) => (
            <p key={tn}>{stepDesc}</p>
          ))}
        <span className="wallet-address">
          {account}
        </span>
      </div>
      <div className="actions-wrapper"></div>
    </div>
  );
};

export default Earn;
