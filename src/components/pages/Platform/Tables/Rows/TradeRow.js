import { useIsMobile, useIsTablet } from "components/hooks";
import config from "config/config";
import { useMemo } from "react";
import { Claim, Sell } from "../../Actions";
import { Coin, Pnl, Value } from "../Values";
import RowItem from './RowItem';

const TradeRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token} />} />
                <RowItem content={<Value text="880,503.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> } />
            </>}
            <RowItem 
                header={config.headers[config.tabs.trade.positions]["P&L"].label} 
                content={<Pnl value="112,000.30024285" token={`${token?.toUpperCase()}`} precents={5.6} /> } 
            />
            <RowItem 
                header={config.headers[config.tabs.trade.positions]["Rewards (claimable today)"].label} 
                content={<Claim />} 
            />
            <RowItem 
                header={config.headers[config.tabs.trade.positions].Leverage.label} 
                content={<Value text="X1" />} 
            />
            <RowItem 
                header={config.headers[config.tabs.trade.positions]["Estimated Liquidation"].label} 
                content={<Value text="22.06.2021" />} 
            />
            {(!isTablet || isMobile) && <RowItem content={<Sell />} /> }
        </>
    ), [token, isTablet, isMobile]);

    if(isHeader) {
        return <>
             <RowItem content={<Coin token={token} />} />
             <RowItem content={<Value text="880,503.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> } />
             {!isMobile && <RowItem type="action" content={<Sell />} /> }
        </>
    }


    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default TradeRow;