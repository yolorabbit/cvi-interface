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
import { customFixed } from '../../../../utils';

const LiquidityRow = ({token, isHeader}) => {
    const { key: tokenName } = token;
    const { account } = useActiveWeb3React();
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const header = useMemo(() => platformConfig.headers[activeViews["view-liquidity"]][platformConfig.tabs["view-liquidity"].liquidity], []);
    const availableBalancePayload = useMemo(() => ({account, type: "withdraw", withStakeAmount: true}), [account]);
    const [liquidityShareData] = useWeb3Api("getAvailableBalance", tokenName, availableBalancePayload, {errorValue: "0"});

    const liquidityPnlPayload = useMemo(() => ({account}), [account]);
    const [liquidityPnl] = useWeb3Api("getLiquidityPNL", tokenName, liquidityPnlPayload, {errorValue: "0"});
    const [poolSize] = useWeb3Api("getPoolSize", tokenName);

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
                    text={liquidityShareData} 
                    subText={`${tokenName.toUpperCase()} (${customFixed(liquidityShareData?.poolShare, 2) ?? '0'}%)`} 
                    format={customFixedTokenValue(liquidityShareData?.myShare, token.fixedDecimals, token.decimals)}
                /> } />
            </>}

            <RowItem 
                header={header["P&L"].label} 
                tooltip={header["P&L"].tooltip} 
                content={<Pnl 
                    value={liquidityPnl} 
                    token={`${tokenName.toUpperCase()}`} 
                    format={customFixedTokenValue(!Number(liquidityPnl?.amount) ? "0" : liquidityPnl?.amount, token.fixedDecimals, token.decimals)}
                    precents={liquidityPnl?.percent} 
                /> } 
            />
            
            <RowItem 
                header={header["Pool size"].label} 
                content={<Value 
                    text={poolSize} 
                    subText={tokenName.toUpperCase()} 
                    format={customFixedTokenValue(poolSize, token.fixedDecimals, token.decimals)}
                />} 
            />

            {(!isTablet || isMobile) && <RowItem content={withdrawController} />}
        </>
    ), [isTablet, tokenName, liquidityShareData, token.fixedDecimals, token.decimals, header, liquidityPnl, poolSize, isMobile, withdrawController]);

    if(isHeader) {
        return <>
            <RowItem content={<Coin token={tokenName} />} />
            <RowItem content={<Value 
                text={liquidityShareData} 
                subText={`${tokenName.toUpperCase()} (${customFixed(liquidityShareData?.poolShare, 2) ?? '0'}%)`} 
                format={customFixedTokenValue(liquidityShareData?.myShare, token.fixedDecimals, token.decimals)}
            /> } />

            {!isMobile && <RowItem type="action" content={withdrawController} /> }
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default LiquidityRow;
