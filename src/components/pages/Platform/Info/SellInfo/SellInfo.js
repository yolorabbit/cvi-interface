import { useActionController } from 'components/Actions/ActionController';
import React, { useMemo } from 'react'
import { commaFormatted, customFixedTokenValue, toBN, toBNAmount } from 'utils';
import { useActiveToken } from 'components/Hooks';
import { useWeb3Api } from 'contracts/useWeb3Api';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { DataState } from 'components/Tables/Elements/Values/DataState';
import HighSellFee from './HighSellFee';
import './SellInfo.scss';

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
            <div className="sell-info-component">
                <div className="sell-info-component__row">
                    <span>Sell amount</span>
                    <span>{commaFormatted(amount) || "0"} {activeToken?.key?.toUpperCase()}</span>
                </div>

                <HighSellFee sellFee={sellFee} sellFeeAmount={sellFeeAmount} />

                <div className="sell-info-component__row">
                    <b>You receive</b>
                    <DataState value={sellFee}>
                        <b>{commaFormatted(receiveAmount?.toString())} {activeToken?.key?.toUpperCase()}</b>
                    </DataState>
                </div>
            </div>
        )
    }, [sellFee, activeToken, amount, tokenAmount])
}

export default SellInfo;