import { useIsMobile, useIsTablet } from "components/Hooks";
import { useMemo, useState } from "react";
import { Coin, Pnl, Value } from "../Values";
import RowItem from './RowItem';
import platformConfig, { activeViews } from "config/platformConfig";
import ActionController from "components/Actions/ActionController";
import PlatformClaim from "components/Actions/PlatformClaim";

const TradeRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");

    const header = useMemo(() => platformConfig.headers[activeViews.trade][platformConfig.tabs.trade.positions], []);

    const sellController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to sell"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={platformConfig.actionsConfig.sell.key}
        />
    }, [token, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token} />} />
                <RowItem content={<Value text="880,503.45637366" subText={`${token?.toUpperCase()}`} /> } />
            </>}
            
            <RowItem 
                header={header["P&L"].label}
                tooltip={header["P&L"].tooltip}
                content={<Pnl value="112,000.30024285" token={`${token?.toUpperCase()}`} precents={5.6} /> } 
            />

            <RowItem 
                header={header["Rewards (claimable today)"].label} 
                tooltip={header["Rewards (claimable today)"].tooltip}
                content={<PlatformClaim />} 
            />

            <RowItem 
                header={header.Leverage.label} 
                content={<Value text="X1" />} 
            />

            <RowItem 
                header={header["Estimated Liquidation"].label} 
                tooltip={header["Estimated Liquidation"].tooltip}
                content={<Value text="22.06.2021" />} 
            />
            {(!isTablet || isMobile) && <RowItem content={sellController} /> }
        </>
        //eslint-disable-next-line
    ), [token, isTablet, isMobile, amount]);

    if(isHeader) {
        return <>
             <RowItem content={<Coin token={token} />} />
             <RowItem content={<Value text="880,503.45637366" subText={`${token?.toUpperCase()}`} /> } />
             {!isMobile && <RowItem type="action" content={sellController} /> }
        </>
    }


    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default TradeRow;