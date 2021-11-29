import ActionController from 'components/Actions/ActionController';
import config from 'config/config';
import React, { useMemo } from 'react'
import './Form.scss';

const Form = ({ amount, setAmount, selectedCurrency, type }) => {
    
    return useMemo(() => (
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
            <SeeMore />
        </div>
    ), [amount, selectedCurrency, setAmount, type]);
}

const SeeMore = () => {
    return useMemo(() => {
        return <div className="see-more-component">
            <span>Please note that the submitted requests expire after 12 hours. You won’t be able to fulfill Mint/Burn request after it is expired.</span>
        </div>
    }, []);
}

export default Form;