import { Withdraw } from "components/pages/Platform/Actions"
import { useIsMobile, useIsTablet } from "components/hooks";
import { useMemo } from "react";
import RowItem from './RowItem';
import Coin from '../Values/Coin';
import Value from '../Values/Value';
import Pnl from '../Values/Pnl';
import config from "config/config";

const LiquidityRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();

    const RowData = useMemo(() => (
        <> 
            {!isTablet && <> 
                <RowItem content={<Coin token={token} />} />
                <RowItem content={<Value text="450,508.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> } />
            </>}

            <RowItem 
                header={config.headers[config.tabs["view-liquidity"].liquidity]["P&L"].label} 
                content={<Pnl value="88,158.30024285" token={`${token?.toUpperCase()}`} precents={5.6} /> } 
            />
            
            <RowItem 
                header={config.headers[config.tabs["view-liquidity"].liquidity]["Pool size"].label} 
                content={<Value text="768.20820509" subText={token?.toUpperCase()} /> } 
            />

            {(!isTablet || isMobile) && <RowItem content={<Withdraw />} />}
        </>
    ), [token, isTablet, isMobile]);

    if(isHeader) {
        return <>
            <RowItem content={<Coin token={token} />} />
            <RowItem content={<Value text="450,508.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> } />
            {!isMobile && <RowItem type="action" content={<Withdraw />} /> }
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default LiquidityRow;
