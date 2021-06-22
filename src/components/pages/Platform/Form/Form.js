import { platformViewContext } from 'components/Context';
import React, { useContext, useMemo, useState } from 'react'
import CurrencySelect from 'components/CurrencySelect';
import Button from 'components/Elements/Button';
import InputAmount from 'components/InputAmount';
import SelectLeverage from 'components/SelectLeverage';
import Details from './Details/Details';
import './Form.scss';

const Form = () => {
    const { activeView } = useContext(platformViewContext);
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    const [amount, setAmount] = useState("");

    return useMemo(() => {
        return (
            <div className="platform-form-component">
               <div className="platform-form-component__left">
                    <CurrencySelect selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    {activeView === 'trade' && <SelectLeverage /> }
                    <InputAmount label="Amount" symbol={selectedCurrency} balance="100000" amount={amount} setAmount={setAmount} />
                    <Button 
                        className="button platform-form-component__left-button" 
                        buttonText={activeView === "trade" ? "BUY" : "DEPOSIT"} 
                    />
               </div>
    
               <div className="platform-form-component__right">
                    <Details selectedCurrency={selectedCurrency?.toUpperCase()} amount={amount} />
               </div>
            
                <SeeMore />    
            </div>
        )
        //eslint-disable-next-line
    }, [activeView, selectedCurrency, amount]) 
}

const SeeMore = () => {
    const { activeView } = useContext(platformViewContext);
    return useMemo(() => {
        return <div className="platform-form-component__bottom">
            {activeView === "trade" ? <p>
                <b>Pay Attention: </b> 
                GOVI tokens will become claimable starting the day after your last position action (UTC time) and for a period of not ece... 
                <b> See more</b>
            </p> : <p>* You will not be able to withdraw your funds for 72 hours <b>See more</b></p>}
        </div>
    }, [activeView]);
}

export default Form;