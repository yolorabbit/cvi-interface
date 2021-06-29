import React, { useEffect } from 'react';
import Button from '../Elements/Button';
import { useLocation } from 'react-router';
import './CurrencySelect.scss';
import platformConfig from 'config/platformConfig';
import { chainNames } from 'config/config';

const CurrencySelect = ({selectedCurrency, setSelectedCurrency}) => {
    const location = useLocation();
    const selectedNetwork = chainNames.Ethereum;
    const currencies = platformConfig.tokens[selectedNetwork];

    useEffect(() => {
        const getCurrencyQuery = new URLSearchParams(location?.search).get('currency');
        if(getCurrencyQuery) {
            const currenctCurrency = currencies[getCurrencyQuery];
            if(!currenctCurrency || currenctCurrency?.soon) return;
            setSelectedCurrency(currenctCurrency.symbol);
        }
        //eslint-disable-next-line
    }, [location?.search]);

    return (
        <div className="currency-select-component">
            <h2 className="currency-select-component__title">Select currency</h2>
            <div className="currency-select-component__container">
                {Object.keys(currencies)
                .map(key => 
                    <Currency 
                        key={key} 
                        state={selectedCurrency === currencies[key].key ? 'selected' : ''} 
                        soon={currencies[key].soon} 
                        name={currencies[key].key?.toUpperCase()} 
                        symbol={currencies[key].key} 
                        setSelectedCurrency={setSelectedCurrency}
                />)}
            </div>
        </div>
    )
}

const Currency = ({ name, symbol, state = '', soon, setSelectedCurrency}) => {
    return (
        <div id={symbol} className={`currency-component ${state} ${soon ? 'coming-soon' : ''}`}>
            <Button className="currency-component__button" disabled={soon} onClick={() => setSelectedCurrency(symbol)}>
                {soon && <span className="coming-soon__text">Coming soon</span>}
                <img className="currency-component__image" src={require(`../../images/coins/${state && `${state}-`}${symbol}.svg`).default} alt="currency" />
            </Button>
            <span className="currency-component__name">{name}</span>
        </div>
    )
}

export default CurrencySelect;
