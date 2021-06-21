import { platformViewContext } from 'components/Context';
import React, { useContext, useMemo, useState } from 'react'
import './Form.scss';
import CurrencySelect from 'components/CurrencySelect';
import Button from 'components/Elements/Button';
import InputAmount from 'components/InputAmount';

const Form = () => {
    const { activeView } = useContext(platformViewContext);
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    
    return useMemo(() => {
        return (
            <div className="platform-form-component">
               <div className="platform-form-component__left">
                    <CurrencySelect selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    <InputAmount label="Amount" symbol={selectedCurrency} balance={"1000000.555555555"} />
                    <Button className="button platform-form-component__left-button" buttonText={activeView === "trade" ? "BUY" : "DEPOSIT"} />
               </div>
    
               <div className="platform-form-component__right">
                    <Details />
               </div>
    
                <div className="platform-form-component__bottom">
                    <p>
                        * You will not be able to withdraw your funds for 72 hours <b>See more</b>
                    </p>
                </div>
            </div>
        )
        //eslint-disable-next-line
    }, [activeView, selectedCurrency]) 
}

const Details = () => {
    return (
        <div className="platform-form-details-component">
            <div className="platform-form-details-component__container">
            
            </div>
        </div>
    )
}

export default Form;