import { useIsMobile, useIsTablet } from "components/hooks";
import config from "config/config";
import { useMemo, useState } from "react";
import { Claim, Sell } from "../../Actions";
import ActionController from "../../Actions/ActionController";
import { Coin, Pnl, Value } from "../Values";
import RowItem from './RowItem';

const TradeRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");

    const sellController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to sell"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            actionComponent={<Sell />}
        />
    }, [token, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token} />} />
                <RowItem content={<Value text="880,503.45637366" subText={`${token?.toUpperCase()}`} /> } />
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