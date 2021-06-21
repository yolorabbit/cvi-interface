import React, { useEffect } from 'react';
import Button from '../Elements/Button';
import { useLocation } from 'react-router';
import './CurrencySelect.scss';

const currenciesMock = {
    "usdt": {
        name: "USDT",
        symbol: "usdt",
        activeNetworks: ['Ethereum']
    },
    eth: {
       name: "ETH",
       symbol: "eth",
       activeNetworks: ['Ethereum']
    },
    coti: {
      name: "COTI",
      symbol: "coti",
      soon: true,
      activeNetworks: ['Ethereum']
   },
}

const CurrencySelect = ({currencies = currenciesMock, selectedCurrency, setSelectedCurrency}) => {
    const location = useLocation();

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
                        state={selectedCurrency === currencies[key].symbol ? 'selected' : ''} 
                        soon={currencies[key].soon} 
                        name={currencies[key].name} 
                        symbol={currencies[key].symbol} 
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
