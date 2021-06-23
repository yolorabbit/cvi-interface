import Button from 'components/Elements/Button';
import React from 'react'
import { useActionController } from './ActionController';

const Deposit = () => {
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
        <div className="deposit-component">
            <Button 
                className="button" 
                buttonText="DEPOSIT"
                onClick={onClick}
            />
        </div>
    )
}

export default Deposit;