import React from 'react'
import './Form.scss';

const Form = ({activeTab}) => {
    return (
        <div className="arbitrage-form-component">
            {activeTab} form
        </div>
    )
}

export default Form;