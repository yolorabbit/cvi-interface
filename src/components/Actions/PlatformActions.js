import Countdown from "components/Countdown/Countdown";
import Button from "components/Elements/Button";
import { useActiveToken } from "components/Hooks";
import { useActiveWeb3React } from "components/Hooks/wallet";
import SellInfo from "components/pages/Platform/Info/SellInfo";
import WithdrawInfo from "components/pages/Platform/Info/WithdrawInfo";
import platformConfig from "config/platformConfig";
import { contractsContext } from "contracts/ContractContext";
import { useContext, useState } from "react";
import { useActionController } from "./ActionController";
import Buy from "./Buy";
import Deposit from './Deposit';

const PlatformActions = () => {
    const { account } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const { disabled, type, token, isModal, isOpen, setIsOpen, amount, setAmount } = useActionController();
    const activeToken = useActiveToken(token);
    const [isProcessing, setIsProcessing] = useState();

    const resetForm = () => {
        setAmount("")
        setIsProcessing(false);
    }

    const onClick = async () => {
        if(!account) return; // ask to connect
        
        if(isModal && !isOpen) return setIsOpen(true);
        setIsProcessing(true);

        try {
            switch(type) {

                case "sell": {
                    console.log("sell");
                    return;
                }

                case "deposit": {
                    console.log("deposit");
                    return;
                }

                case "withdraw": {
                    console.log("withdraw");
                    return;
                }

                case "claim": {
                    console.log("claim");
                    return;
                }

                default:
                    return null;
            }
        
        } catch(error) {
            console.log(error);
        } finally {
            resetForm();    
        }
    }

    const renderView = () => {
        switch(type) {
            case platformConfig.actionsConfig.sell.key:
                return <div className="sell-component">
                <div className="sell-component__container">
                    {(isOpen && !isModal) && <SellInfo />}
                    <Countdown />
                    <Button 
                        className="sell-component__container--button" 
                        buttonText="Sell" 
                        onClick={onClick}
                        disabled={disabled}
                        processing={isProcessing}
                    />
                </div>
            </div>
            case platformConfig.actionsConfig.withdraw.key:
                return  <div className="withdraw-component">
                    <div className="withdraw-component__container">
                        {(isOpen && !isModal) && <WithdrawInfo />}
                        <Countdown />
                        <Button 
                            className="withdraw-component__container--button"
                            buttonText="Withdraw" 
                            onClick={onClick}
                            disabled={disabled}
                            processing={isProcessing}
                        />
                    </div>
                </div>

            case platformConfig.actionsConfig.claim.key: {
                return  <div className="claim-component">
                    <b>100,587.01164174</b>
                    <span>&nbsp;GOVI (2,700 GOVI) </span>
                    <Button 
                        className="claim-button" 
                        buttonText="Claim" 
                        onClick={onClick} 
                        disabled={disabled}
                        processing={isProcessing}
                    /> 
                </div>
            }
                
            case platformConfig.actionsConfig.deposit.key: {
                return <Deposit />
            }
            
            default:
                return <Buy />
        }
    }

    return renderView();
}

export default PlatformActions;