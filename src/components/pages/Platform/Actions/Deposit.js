import Button from 'components/Elements/Button';
import React from 'react'
import { useActionController } from './ActionController';

const Deposit = () => {
    const { token, isModal, setIsOpen, amount, setAmount } = useActionController();

    const onClick = () => {
        console.log(token, amount);
        if(isModal) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }

        setAmount("");
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