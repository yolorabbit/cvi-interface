import React, { useEffect, useMemo } from 'react'
import { commaFormatted, customFixed, customFixedTokenValue } from 'utils';
import Button from 'components/Elements/Button';
import Input from 'components/Elements/Input';
import config from 'config/config';
import './InputAmount.scss';
import InputGroup from 'components/InputGroup';
import { useWeb3Api } from 'contracts/useWeb3Api';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useActiveToken } from 'components/Hooks';
import Spinner from 'components/Spinner/Spinner';

const InputAmount = ({label = "Amount", breakLine, amount, setAmount, symbol, availableText = "Your available balance:", error}) => {
    const activeToken = useActiveToken(symbol); 
    const { account } = useActiveWeb3React();
    
    const availableBalancePayload = useMemo(() => ({account}), [account]);
    const availableBalance = useWeb3Api("getAvailableBalance", symbol, availableBalancePayload);

    const availableBalanceAmount = useMemo(() => customFixedTokenValue(availableBalance, activeToken.decimals, activeToken.decimals), [activeToken, availableBalance]);
    const inufficientBalance = useMemo(() => amount > availableBalanceAmount, [amount, availableBalanceAmount]);

    useEffect(() => {
        setAmount("");
        //eslint-disable-next-line
    }, [symbol])

    const _onChangeNumber = (value) => {
        if(value?.split && value?.split('.')?.length > 0 && value?.split('.')?.[1]?.length > activeToken.fixedDecimals) return;
        
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
        <InputGroup className={`amount-component__group ${(error || inufficientBalance) ? 'error' : ''}`} label={label}>
            <div className="amount-component__group__input-container">
                <Input 
                    className="amount-component__group__amount" 
                    type="text" placeholder="Enter amount"
                    value={amount} onChange={({target: { value }}) => _onChangeNumber(value)}
                />
                
                <div className="amount-component__group__container">
                    <Button className="amount-component__group__container--max" buttonText="Max" onClick={() => _onChangeNumber(String(availableBalanceAmount))}/>
                    <span className={`amount-component__group__container--currency ${symbol}`}>{mapSymbol()}</span>
                </div>
            </div>
            {availableBalance !== "N/A" && <>
                <span className="amount-component__group__balance">
                    <span>{availableText} {availableBalance === null ? <>&nbsp; <Spinner className="statistics-spinner" /></> : <b>
                        &nbsp;<span> {commaFormatted(availableBalanceAmount ? customFixed(availableBalanceAmount, activeToken.decimals) : "0")} </span>
                        &nbsp;{symbol === 'rhegic2-eth' ? <span style={{textTransform: 'none'}}>rHEGIC2-ETH</span> : symbol}
                    </b> }</span> 
                </span>
            </> }
        </InputGroup>
    )
}

export default InputAmount;