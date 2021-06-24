import Countdown from 'components/Countdown/Countdown';
import Button from 'components/Elements/Button';
import React from 'react'
import WithdrawInfo from '../Info/WithdrawInfo';
import { useActionController } from './ActionController';

const Withdraw = () => {
    const { token, isModal, isOpen, setIsOpen, amount } = useActionController();

    const onClick = () => {
        console.log(token, amount);
        if(isModal) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }

    return (
        <div className="withdraw-component">
            <div className="withdraw-component__container">
                {(isOpen && !isModal) && <WithdrawInfo />}
                <Countdown />
                <Button className="withdraw-component__container--button" buttonText="Withdraw" onClick={onClick} />
            </div>
        </div>
    )
}

export default Withdraw;