import ActionController from 'components/Actions/ActionController';
import React from 'react'
import './Form.scss';

const Form = ({ amount, setAmount, selectedCurrency, type }) => {
    
    return (
        <div className="arbitrage-form-component">
            <ActionController 
                amount={amount}
                setAmount={setAmount}
                token={selectedCurrency}
                type={type}
                balances={{ tokenAmount: "0" }}
                disabled={!amount}
            />
        </div>
    )
}

export default Form;