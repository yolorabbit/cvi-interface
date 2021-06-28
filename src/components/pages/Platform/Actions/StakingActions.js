import Countdown from "components/Countdown/Countdown";
import Button from "components/Elements/Button";
import stakingConfig from "config/stakingConfig";
import WithdrawInfo from "../Info/WithdrawInfo";
import { useActionController } from "./ActionController";

const StakingActions = () => {
    const { type, token, isModal, isOpen, setIsOpen, amount, setAmount, leverage } = useActionController();

    const resetForm = () => {
        setAmount("")
    }

    const onClick = () => {
        if(isModal && !isOpen) return setIsOpen(true);
        resetForm();

        console.log(token);
        console.log(amount);
        console.log(leverage);

        return {
            stake: () => {
                console.log("stake");
            },
            unstake: () => {
                console.log("unstake");
            },
            claim: () => {
                console.log("claim");
            },
        }
    }

    const renderView = () => {
        switch(type) {
            case stakingConfig.actionsConfig.unstake.key:
                return <div className="unstake-component">
                <div className="unstake-component__container">
                    <Button 
                        className="unstake-component__container--button" 
                        buttonText="Unstake" 
                        onClick={() => onClick?.()?.[type]?.()}
                    />
                    {!isModal && isOpen && <span className="pay-attention">
                     * Pay Attention: After unstaking your LP tokens, you won't be able to withdraw your liquidity for up to 72 hours.
                    </span>}
                </div>
            </div>

            case stakingConfig.actionsConfig.stake.key:
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

            case stakingConfig.actionsConfig.claim.key: {
                return  <div className="claim-component">
                    <b>100,587.01164174</b>
                    <span>&nbsp;GOVI (2,700 GOVI) </span>
                    <Button className="claim-button" buttonText="Claim" onClick={() => {}} /> 
                </div>
            }
                

            default:
                return null;
        }
    }

    return renderView();
}

export default StakingActions;