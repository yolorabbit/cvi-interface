import Button from 'components/Elements/Button';
import config from 'config/config';
import React from 'react'
import { useActionController } from './ActionController';
import SellInfo from '../Info/SellInfo';
import Countdown from 'components/Countdown/Countdown';
import WithdrawInfo from '../Info/WithdrawInfo';

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
            case config.actionsConfig.sell.key:
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
            case config.actionsConfig.withdraw.key:
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

            case config.actionsConfig.claim.key:
                return <div className="sell-component withdraw-component">
                    <Button 
                        className="button" 
                        buttonText={config.actionsConfig.buy.key?.toUpperCase()}
                        onClick={() => onClick?.()?.[type]?.()}
                    />
                </div>;

            default:
                return <div className="buy-component">
                <Button 
                    className="button" 
                    buttonText={config.actionsConfig[type ?? 'buy'].key?.toUpperCase()}
                    onClick={() => onClick?.()?.[type]?.()}
                />
            </div>;
        }
    }

    return renderView();
}

export default Action;