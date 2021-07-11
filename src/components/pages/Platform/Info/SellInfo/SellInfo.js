import { useActionController } from 'components/Actions/ActionController';
import React, { useMemo } from 'react'
import './SellInfo.scss';
import { commaFormatted, customFixedTokenValue, toBN, toBNAmount } from 'utils';
import { useActiveToken } from 'components/Hooks';
import { useWeb3Api } from 'contracts/useWeb3Api';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import Spinner from 'components/Spinner/Spinner';

const SellInfo = () => {
    const { account } = useActiveWeb3React();
    const { token, amount } = useActionController();
    const activeToken = useActiveToken(token);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const sellFeePayload = useMemo(() => ({ tokenAmount, account } ), [tokenAmount, account]);
    const [sellFee] = useWeb3Api("getClosePositionFee", token, sellFeePayload, { validAmount: true});

    return useMemo(() => {
        const sellFeeAmount = sellFee !== null && sellFee !== "N/A" && customFixedTokenValue(sellFee?.toString(), activeToken.decimals, activeToken.decimals);
        // const receiveAmount = tokenAmount && sellFee !== null && sellFee !== "N/A" && tokenAmount.sub(toBN(sellFee));
        let receiveAmount = toBN("0");
        if(tokenAmount?.gt(toBN("0")) && toBN(sellFee)?.gt(toBN("0"))) {
            receiveAmount = customFixedTokenValue(tokenAmount.sub(toBN(sellFee)), activeToken.decimals, activeToken.decimals);
        }

        return (
            <div div className="sell-info-component">
                <div className="sell-info-component__row">
                    <span>Sell amount</span>
                    <span>{commaFormatted(amount) || "0"} {activeToken?.key?.toUpperCase()}</span>
                </div>

                <div className="sell-info-component__row low">
                    <span>Sell fee</span>
                    {sellFee === null ? <Spinner className="statistics-spinner" /> : 
                        sellFee !== "N/A" ?
                     <span>{commaFormatted(sellFeeAmount)} {activeToken?.key?.toUpperCase()}</span> : <span>N/A</span>}
                </div>

                <div className="sell-info-component__row">
                    <b>You receive</b>
                    {sellFee === null ? <Spinner className="statistics-spinner" /> : 
                        sellFee !== "N/A" ?
                     <b>{commaFormatted(receiveAmount?.toString())} {activeToken?.key?.toUpperCase()}</b> : <span>N/A</span>}
                </div>
            </div>
        )
    }, [sellFee, activeToken, amount, tokenAmount])
}

export default SellInfo;