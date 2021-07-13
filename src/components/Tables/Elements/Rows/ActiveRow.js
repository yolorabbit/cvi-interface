import platformConfig, { activeViews } from "config/platformConfig"
import { stakingViews } from "config/stakingConfig"
import { useMemo } from "react"
import HistoryRow from "./HistoryRow"
import LiquidityRow from "./LiquidityRow"
import StakeAssetsRow from "./StakeAssetsRow"
import StakedAssetsRow from "./StakedAssetsRow"
import TradeRow from "./TradeRow"

const ActiveRow = ({activeTab, isHeader, rowData}) => {
    return useMemo(() => {
        switch(activeTab) {
            case activeViews.history: {
                return <HistoryRow rowData={rowData} isHeader={isHeader} />
            }
    
            case platformConfig.tabs.trade.positions:
                return <TradeRow token={rowData.key} isHeader={isHeader} />
            
            case platformConfig.tabs['view-liquidity'].liquidity:
                return <LiquidityRow token={rowData.key} isHeader={isHeader} />
    
            case stakingViews.staked:
                    return <StakedAssetsRow rowData={rowData} isHeader={isHeader} />
    
            case stakingViews["available-to-stake"]:
                return <StakeAssetsRow rowData={rowData} isHeader={isHeader} />
    
            default:
                return null;
        }
    }, [activeTab, isHeader, rowData]);
}

export default ActiveRow;