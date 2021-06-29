import { useIsMobile, useIsTablet } from "components/hooks";
import { useMemo, useState } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import Pnl from '../Values/Pnl';
import platformConfig, { activeViews } from "config/platformConfig";
import ActionController from "components/Actions/ActionController";

const LiquidityRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const [amount, setAmount] = useState("");
    const header = useMemo(() => platformConfig.headers[activeViews["view-liquidity"]][platformConfig.tabs["view-liquidity"].liquidity], []);

    const withdrawController = useMemo(() => {
        return <ActionController 
            amountLabel="Select amount to withdraw"
            isModal 
            token={token}
            amount={amount}
            setAmount={setAmount}
            type={platformConfig.actionsConfig.withdraw.key}
        />
    }, [token, amount]);

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token} />} />
                <RowItem content={<Value text="450,508.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> } />
            </>}

            <RowItem 
                header={header["P&L"].label} 
                tooltip={header["P&L"].tooltip} 
                content={<Pnl value="88,158.30024285" token={`${token?.toUpperCase()}`} precents={5.6} /> } 
            />
            
            <RowItem 
                header={header["Pool size"].label} 
                content={<Value text="768.20820509" subText={token?.toUpperCase()} /> } 
            />

            {(!isTablet || isMobile) && <RowItem content={withdrawController} />}
        </>
        //eslint-disable-next-line
    ), [token, isTablet, isMobile, amount]);

    if(isHeader) {
        return <>
            <RowItem content={<Coin token={token} />} />
            <RowItem content={<Value text="450,508.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> } />
            {!isMobile && <RowItem type="action" content={withdrawController} /> }
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default LiquidityRow;
