import Countdown from 'components/Countdown/Countdown';
import Button from 'components/Elements/Button';
import React from 'react'
import SellInfo from '../Info/SellInfo';
import { useActionController } from './ActionController';

const Sell = () => {
    const { token, isModal, setIsOpen, isOpen, amount } = useActionController();

    console.log(isOpen);
    
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
                {(isOpen && !isModal) && <SellInfo />}
                <Countdown />
                <Button className="sell-component__container--button" buttonText="Sell" onClick={onClick} />
            </div>
        </div>
    )
}

export default Sell;