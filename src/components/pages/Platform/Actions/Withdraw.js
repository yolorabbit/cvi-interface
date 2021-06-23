import Countdown from 'components/Countdown/Countdown';
import Button from 'components/Elements/Button';
import React from 'react'
import { useActionController } from './ActionController';

const Withdraw = () => {
    const { token, isModal, setIsOpen, amount } = useActionController();

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
                <Countdown />
                <Button className="withdraw-component__container--button" buttonText="Withdraw" onClick={onClick} />
            </div>
        </div>
    )
}

export default Withdraw;