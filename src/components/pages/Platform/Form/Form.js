import { platformViewContext } from 'components/Context';
import React, { useContext, useMemo, useState } from 'react'
import CurrencySelect from 'components/CurrencySelect';
import SelectLeverage from 'components/SelectLeverage';
import Details from './Details/Details';
import platformConfig, { activeViews } from 'config/platformConfig';
import ActionController from 'components/Actions/ActionController';
import './Form.scss';

const Form = () => {
    const { activeView } = useContext(platformViewContext);
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    const [leverage, setLeverage] = useState("X1");
    const [amount, setAmount] = useState("");
  
    return useMemo(() => {
        return (
            <div className="platform-form-component">
               <div className="platform-form-component__left">
                    <CurrencySelect selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    {activeView === 'trade' && <SelectLeverage leverage={leverage} setLeverage={setLeverage} /> }
                  
                    <ActionController 
                        amount={amount}
                        setAmount={setAmount}
                        token={selectedCurrency}
                        leverage={leverage}
                        type={activeView === "trade" ? platformConfig.actionsConfig.buy.key : platformConfig.actionsConfig.deposit.key}
                    />
               </div>
    
               <div className="platform-form-component__right">
                    <Details selectedCurrency={selectedCurrency?.toUpperCase()} amount={amount} leverage={leverage} />
               </div>
            
                <SeeMore />    
            </div>
        )
        //eslint-disable-next-line
    }, [activeView, selectedCurrency, amount, leverage]) 
}

const SeeMore = () => {
    const { activeView } = useContext(platformViewContext);
    return useMemo(() => {
        return <div className="platform-form-component__bottom">
            {activeView === activeViews.trade ? <p>
                <b>Pay Attention: </b> 
                GOVI tokens will become claimable starting the day after your last open position action (UTC time) and for a period not exceeding 30 days. If you already have claimable GOVI tokens, opening a position now will disable the ability to claim them until the end of the day (UTC time).
                Please also note that you won't be able to sell your position within the next 6 hours.
            </p> : <p><b>Pay Attention: </b>you won't be able to withdraw your liquidity within the next 72 hours.</p>}
        </div>
    }, [activeView]);
}

export default Form;