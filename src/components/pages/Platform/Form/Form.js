import { platformViewContext } from 'components/Context';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import CurrencySelect from 'components/CurrencySelect';
import SelectLeverage from 'components/SelectLeverage';
import Details from './Details/Details';
import platformConfig, { activeViews } from 'config/platformConfig';
import ActionController from 'components/Actions/ActionController';
import './Form.scss';
import { useSelector } from 'react-redux';

const Form = () => {
    const { activeView } = useContext(platformViewContext);
    const { selectedNetwork } = useSelector(({app}) => app);
    const [selectedCurrency, setSelectedCurrency] = useState("usdt");
    const tokenLeverageList = platformConfig.tokens?.[selectedNetwork]?.[selectedCurrency]?.leverage;
    const [leverage, setLeverage] = useState(tokenLeverageList?.[0]);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if(!platformConfig.tokens[selectedCurrency]?.leverage) setLeverage();
        
        if(tokenLeverageList?.length > 0) {
            setLeverage(tokenLeverageList?.[0]);
        }
        //eslint-disable-next-line
    }, [selectedCurrency]);

    return useMemo(() => {
        return (
            <div className="platform-form-component">
               <div className="platform-form-component__left">
                    <CurrencySelect selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    {activeView === 'trade' 
                        && platformConfig.tokens?.[selectedNetwork]?.[selectedCurrency]?.leverage 
                        && <SelectLeverage selectedCurrency={selectedCurrency} leverage={leverage} tokenLeverageList={tokenLeverageList} setLeverage={setLeverage} /> }
                  
                    <ActionController 
                        disabled={!amount}
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
    }, [activeView, selectedCurrency, selectedNetwork, amount, leverage]) 
}

const SeeMore = () => {
    const { activeView } = useContext(platformViewContext);
    return useMemo(() => {
        return <div className="platform-form-component__bottom">
            {activeView === activeViews.trade ? <p>
                <b>Pay Attention: </b> 
                GOVI tokens will become claimable starting the day after your last open position action (UTC time) and for a period not exceeding 30 days.
                Please also note that you won't be able to sell your position within the next 6 hours.
            </p> : <p><b>Pay Attention: </b>you won't be able to withdraw your liquidity within the next 72 hours.</p>}
        </div>
    }, [activeView]);
}

export default Form;