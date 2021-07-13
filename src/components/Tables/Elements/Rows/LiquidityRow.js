import { useIsMobile, useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import Pnl from '../Values/Pnl';
import platformConfig, { activeViews } from "config/platformConfig";
import ActionController from "components/Actions/ActionController";
import { useActiveWeb3React } from '../../../Hooks/wallet';
import { useWeb3Api } from '../../../../contracts/useWeb3Api';
import { customFixedTokenValue } from "utils";

const LiquidityRow = ({token, isHeader}) => {
    const { key: tokenName } = token;
    const { account } = useActiveWeb3React();
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const header = useMemo(() => platformConfig.headers[activeViews["view-liquidity"]][platformConfig.tabs["view-liquidity"].liquidity], []);
    const availableBalancePayload = useMemo(() => ({account, type: "withdraw", withStakeAmount: true}), [account]);
    const [liquidityBalance] = useWeb3Api("getAvailableBalance", tokenName, availableBalancePayload, {errorValue: "0"});

    console.log(liquidityBalance?.toString());
    const withdrawController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to withdraw"
            isModal 
            token={tokenName}
            amount={amount}
            setAmount={setAmount}
            type={platformConfig.actionsConfig.withdraw.key}
        />
    }, [tokenName, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={tokenName} />} />
                <RowItem content={<Value 
                    text={liquidityBalance} 
                    subText={`${tokenName.toUpperCase()} (0.03%)`} 
                    format={customFixedTokenValue(liquidityBalance?.toString(), token.fixedDecimals, token.decimals)}
                /> } />
            </>}

            <RowItem 
                header={header["P&L"].label} 
                tooltip={header["P&L"].tooltip} 
                content={<Pnl value="88,158.30024285" token={`${tokenName.toUpperCase()}`} precents={5.6} /> } 
            />
            
            <RowItem 
                header={header["Pool size"].label} 
                content={<Value text="768.20820509" subText={tokenName.toUpperCase()} /> } 
            />

            {(!isTablet || isMobile) && <RowItem content={withdrawController} />}
        </>
    ), [isTablet, tokenName, liquidityBalance, token.fixedDecimals, token.decimals, header, isMobile, withdrawController]);

    if(isHeader) {
        return <>
            <RowItem content={<Coin token={token} />} />
            <RowItem content={<Value text="450,508.45637366" subText={`${tokenName.toUpperCase()} (0.03%)`} /> } />
            {!isMobile && <RowItem type="action" content={withdrawController} /> }
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default LiquidityRow;
