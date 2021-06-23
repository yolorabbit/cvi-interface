import Countdown from 'components/Countdown/Countdown';
import Button from 'components/Elements/Button';
import React from 'react'
import { useActionController } from './ActionController';

const Sell = () => {
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
        <div className="sell-component">
            <div className="sell-component__container">
                <Countdown />
                <Button className="sell-component__container--button" buttonText="Sell" onClick={onClick} />
            </div>
        </div>
    )
}

export default Sell;