import { useIsMobile, useIsTablet } from "components/Hooks";
import { useContext, useMemo, useState } from "react";
import { Coin, Pnl, Value } from "../Values";
import RowItem from './RowItem';
import platformConfig, { activeViews } from "config/platformConfig";
import ActionController from "components/Actions/ActionController";
import PlatformClaim from "components/Actions/PlatformClaim";
import { useWeb3Api } from "contracts/useWeb3Api";
import { useActiveWeb3React } from "components/Hooks/wallet";
import { customFixedTokenValue } from "utils";
import { useSelector } from "react-redux";
import { platformViewContext } from "components/Context";

const TradeRow = ({token, isHeader}) => {
    const { account } = useActiveWeb3React();
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const positionValue = token.data.positionValue;
    const positionPnlPayload = useMemo(() => ({account}), [account]);
    const [positionPnlData] = useWeb3Api("getPositionsPNL", token.key, positionPnlPayload, {errorValue: "0", updateOn: "positions"});
    const { activeView } = useContext(platformViewContext);
    const wallet = useSelector(({wallet}) => wallet);
    
    const historyData = useMemo(() => {
        return wallet?.[activeView === activeViews["view-liquidity"] ? 'liquidities' : 'positions'];
    }, [activeView, wallet]);

    const header = useMemo(() => platformConfig.headers[activeViews.trade][platformConfig.tabs.trade.positions], []);
    const posArrayByToken = historyData?.length ? historyData.filter(({type, amount})=> type.toLowerCase() === "buy" && amount.toLowerCase().includes(token.key)) : [];
    const leverage = posArrayByToken.length ? posArrayByToken[0].leverage : "N/A";

    const sellController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to sell"
            isModal 
            token={token.key}
            amount={amount}
            setAmount={setAmount}
            type={platformConfig.actionsConfig.sell.key}
        />
    }, [token, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token.key} />} />
                <RowItem content={<Value 
                    text={positionValue} 
                    subText={`${token.key.toUpperCase()}`} 
                    format={customFixedTokenValue(positionValue?.toString(), token.fixedDecimals, token.decimals)}
                /> } />
            </>}
            
            <RowItem 
                header={header.Leverage.label} 
                content={<Value text={leverage} />} 
            />

            <RowItem 
                header={header["P&L"].label}
                tooltip={header["P&L"].tooltip}
                content={<Pnl 
                    value={positionPnlData} 
                    token={`${token.key.toUpperCase()}`} 
                    format={customFixedTokenValue(!Number(positionPnlData?.amount) ? "0" :  positionPnlData?.amount, token.fixedDecimals, token.decimals)}
                    /> } 
            />

            <RowItem 
                header={header["Rewards (claimable today)"].label} 
                tooltip={header["Rewards (claimable today)"].tooltip}
                content={<PlatformClaim token={token} />} 
            />
        
            {(!isTablet || isMobile) && <RowItem content={sellController} /> }
        </>
    ), [isTablet, token, positionValue, header, positionPnlData, isMobile, sellController, leverage]);

    if(isHeader) {
        return <>
            <RowItem content={<Coin token={token.key} />} />
            <RowItem content={<Value 
                text={positionValue} 
                subText={`${token.key.toUpperCase()}`} 
                format={customFixedTokenValue(positionValue?.toString(), token.fixedDecimals, token.decimals)}
            />}/>

             {!isMobile && <RowItem type="action" content={sellController} /> }
        </>
    }


    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default TradeRow;