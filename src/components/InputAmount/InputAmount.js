import React, { useEffect } from 'react'
import { commaFormatted, customFixed } from 'utils';
import Button from 'components/Elements/Button';
import Input from 'components/Elements/Input';
import config from 'config/config';
import './InputAmount.scss';
import InputGroup from 'components/InputGroup';

const InputAmount = ({label = "Amount", breakLine, amount, setAmount, symbol, decimals = 6, balance, availableBalanceDecimals, availableText = "Your available balance:", error}) => {
    useEffect(() => {
        setAmount("");
        //eslint-disable-next-line
    }, [symbol])

    const _onChangeNumber = (value) => {
        if(value?.split && value?.split('.')?.length > 0 && value?.split('.')?.[1]?.length > decimals) return;
        
        if(Number(value) > 999999999999) return;

        if (value?.match && value.match(/[+-]?([0-9]*[.])?[0-9]+/) && !isNaN(value)) {
            setAmount(value);
        }

        if(!value.length) {
            setAmount('');
        }
    }

    const mapSymbol = () => {
        if(!breakLine) return symbol;
        const [from, to] = symbol.split('-');
        return from && to ? <><span>{from === config.pages.home.sections.getCviTokens.info.rhegic2.toLowerCase() ? config.pages.home.sections.getCviTokens.info.rhegic2 : from}</span><span>{to.toUpperCase()}</span></> : <span>{symbol}</span>;
    }

    return (
        <InputGroup className={`amount-component__group ${error ? 'error' : ''}`} label={label}>
            <div className="amount-component__group__input-container">
                <Input className="amount-component__group__amount" type="text" placeholder="Enter amount" value={amount} onChange={({target: { value }}) => _onChangeNumber(value)}/>
                <div className="amount-component__group__container">
                    <Button className="amount-component__group__container--max" buttonText="Max" onClick={() => _onChangeNumber(String(balance))}/>
                    <span className={`amount-component__group__container--currency ${symbol}`}>{mapSymbol()}</span>
                </div>
            </div>
            {balance >= 0 && <>
                <span className="amount-component__group__balance">
                    <span>{availableText} </span> 
                    <b>
                        <span> {commaFormatted(balance ? customFixed(balance, availableBalanceDecimals >= 0 ? availableBalanceDecimals : decimals < 8 ? decimals : 8) : "0")} </span>
                        {symbol === 'rhegic2-eth' ? <span style={{textTransform: 'none'}}>rHEGIC2-ETH</span> : symbol}
                    </b>
                </span>
            </> }
        </InputGroup>
    )
}

export default InputAmount;