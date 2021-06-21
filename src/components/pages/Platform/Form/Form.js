import { platformViewContext } from 'components/Context';
import React, { useContext, useMemo, useState } from 'react'
import CurrencySelect from 'components/CurrencySelect';
import Button from 'components/Elements/Button';
import InputAmount from 'components/InputAmount';
import Stat from 'components/Stat';
import SelectLeverage from 'components/SelectLeverage';
import './Form.scss';

const Form = () => {
    const { activeView } = useContext(platformViewContext);
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    
    return useMemo(() => {
        return (
            <div className="platform-form-component">
               <div className="platform-form-component__left">
                    <CurrencySelect selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    {activeView === 'trade' && <SelectLeverage /> }
                    <InputAmount label="Amount" symbol={selectedCurrency} balance={"1000000.555555555"} />
                    <Button className="button platform-form-component__left-button" buttonText={activeView === "trade" ? "BUY" : "DEPOSIT"} />
               </div>
    
               <div className="platform-form-component__right">
                    <Details selectedCurrency={selectedCurrency?.toUpperCase()} />
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

const Details = ({selectedCurrency}) => {
    const { activeView } = useContext(platformViewContext);
 
    return useMemo(() => {
        return (
            <div className="platform-form-details-component">
                <div className="platform-form-details-component__container">
                    <Stat className="bold" title="Collateral ratio" value="65%" />

                    {activeView === 'trade' && <Stat className="bold" title="Leverage" value="X2" /> }

                    <div className="platform-form-details-component__container--amount">
                        <span>{activeView === 'trade' ? "Buy" : "Deposit"} amount</span>
                        <b>100,000.00021455 {selectedCurrency}</b>
                    </div>

                    {activeView === "trade" ? <> 
                        <Stat title="Purchase fee" value={`0.10007213 ${selectedCurrency}`} />

                        <Stat className="bold green" title="Your position" value={`3.93287142 ${selectedCurrency}`} />

                        <Stat title="Open position reward" value="100 GOVI" />

                        <Stat title="Current funding fee" value={`0.01 ${selectedCurrency}`} />
                    </> : <Stat className="bold" title="You will receive" value="0.4 CVI-ETH-LP" /> }

                    <Stat title="CVI Index" value="39.8" />
                </div>
            </div>
        )
    }, [selectedCurrency, activeView]); 
}

export default Form;