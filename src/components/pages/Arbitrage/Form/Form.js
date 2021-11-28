import ActionController from 'components/Actions/ActionController';
import config from 'config/config';
import React from 'react'
import './Form.scss';

const Form = ({ amount, setAmount, selectedCurrency, type }) => {
    
    return (
        <div className="arbitrage-form-component">
            <ActionController 
                view={config.routes.arbitrage.path}
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