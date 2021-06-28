import platformConfig, { activeViews } from "config/platformConfig"
import { stakingViews } from "config/stakingConfig"
import HistoryRow from "./HistoryRow"
import LiquidityRow from "./LiquidityRow"
import StakedAssetsRow from "./StakedAssetsRow"
import TradeRow from "./TradeRow"

const ActiveRow = ({token, activeTab, isHeader}) => {
    switch(activeTab) {
        case activeViews.history: {
            return <HistoryRow token={token} isHeader={isHeader} />
        }

        case platformConfig.tabs.trade.positions:
            return <TradeRow token={token} isHeader={isHeader} />
        
        case platformConfig.tabs['view-liquidity'].liquidity:
            return <LiquidityRow token={token} isHeader={isHeader} />

        case stakingViews.staked:
            return <StakedAssetsRow token={token} isHeader={isHeader} />

        default:
            return null;
    }
}

export default ActiveRow;