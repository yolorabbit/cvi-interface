import Countdown from "components/Countdown/Countdown";
import Button from "components/Elements/Button";
import SellInfo from "components/pages/Platform/Info/SellInfo";
import WithdrawInfo from "components/pages/Platform/Info/WithdrawInfo";
import platformConfig from "config/platformConfig";
import { useActionController } from "./ActionController";

const PlatformActions = () => {
    const { type, token, isModal, isOpen, setIsOpen, amount, setAmount, leverage } = useActionController();
    const acount = "sdgsdg";

    const resetForm = () => {
        setAmount("")
    }

    const onClick = () => {
        if(!acount) return; // ask to connect
        
        if(isModal && !isOpen) return setIsOpen(true);
        resetForm();

        console.log(token);
        console.log(amount);
        console.log(leverage);

        return {
            buy: () => {
                console.log("buy");
            },
            sell: () => {
                console.log("sell");
            },
            deposit: () => {
                console.log("deposit");
            },
            withdraw: () => {
                console.log("withdraw");
            },
            claim: ()=> {
                console.log("claim");
            },
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
                        onClick={() => onClick?.()?.[type]?.()}
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
                            onClick={() => onClick?.()?.[type]?.()} 
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
                        onClick={() => {}} 
                    /> 
                </div>
            }
                

            default:
                return <div className="buy-component">
                <Button 
                    className="button" 
                    buttonText={platformConfig.actionsConfig?.[type]?.key?.toUpperCase()}
                    onClick={() => onClick?.()?.[type]?.()}
                />
            </div>;
        }
    }

    return renderView();
}

export default PlatformActions;