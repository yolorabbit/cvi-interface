import Button from 'components/Elements/Button';
import React from 'react'
import { useActionController } from './ActionController';

const Buy = () => {
    const { token, isModal, setIsOpen, amount } = useActionController();
    console.log(token);
    console.log(amount);
    console.log(isModal);
    console.log(amount);

    const onClick = () => {
        if(isModal) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }
    
    return (
        <div className="buy-component">
            <Button 
                className="button" 
                buttonText="BUY"
                onClick={onClick}
            />
        </div>
    )
}

export default Buy;