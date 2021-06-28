import { useIsMobile, useIsTablet } from "components/hooks";
import { useContext, useMemo } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import { platformViewContext } from "components/Context";
import platformConfig, { activeViews } from "config/platformConfig";

const HistoryRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const { activeView } = useContext(platformViewContext); 
    const headers = useMemo(() => Object.values(platformConfig.headers?.[activeView]?.History), [activeView]);
  
    const historyData = activeView === activeViews["view-liquidity"] ? {
        date: "07/11/2020",
        type: "Liquidation",
        amount: `1 ETH`,
    } : {
        date: "07/11/2020",
        type: "Liquidation",
        index: "77",
        amount: `1 ETH`,
        leverage: "X1",
        fees: `0.9 ETH`,
        netAmount: `0.1 ETH`
    }

    const RowData = useMemo(() => (
        <> 
            {Object.values(historyData)?.map((value, index) => <RowItem 
                key={index}
                header={headers[index]} 
                content={<Value subText={value} />} 
            />)}
        </>
        //eslint-disable-next-line
    ), [token, isTablet, isMobile, historyData, activeView]);

    if(isHeader) {
        return <>
            <RowItem content={<Value text={historyData.date} /> } />
            <RowItem content={<Value text={historyData.type} /> } />
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default HistoryRow;
