import { useActionController } from './ActionController';
import Button from 'components/Elements/Button';
import React from 'react'
import SellInfo from '../Info/SellInfo';
import Countdown from 'components/Countdown/Countdown';
import WithdrawInfo from '../Info/WithdrawInfo';
import './Action.scss';
import platformConfig from 'config/platformConfig';

const Action = () => {
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
                console.log(type);
                return  <div className="claim-component">
                <b>100,587.01164174</b>
                <span>&nbsp;GOVI (2,700 GOVI) </span>
                <Button className="claim-button" buttonText="Claim" onClick={() => {}} /> 
            </div>
            }
                

            default:
                return <div className="buy-component">
                <Button 
                    className="button" 
                    buttonText={platformConfig.actionsConfig[type ?? 'buy'].key?.toUpperCase()}
                    onClick={() => onClick?.()?.[type]?.()}
                />
            </div>;
        }
    }

    return renderView();
}

export default Action;