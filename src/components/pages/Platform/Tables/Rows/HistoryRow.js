import { useIsMobile, useIsTablet } from "components/hooks";
import { useContext, useMemo } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import config from "config/config";
import { platformViewContext } from "components/Context";

const HistoryRow = ({token, isHeader}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();
    const { activeView } = useContext(platformViewContext); 
    
    const historyData = activeView === 'view-liquidity' ? {
        date: "07/11/2020",
        type: "Liquidation",
        amount: `1 ETH`,
    } : {
        date: "07/11/2020",
        type: "Liquidation",
        index: "77",
        leverage: "X1",
        amount: `1 ETH`,
        fees: `0.9 ETH`,
        netAmount: `0.1 ETH`
    }

    const RowData = useMemo(() => (
        <> 
            {Object.values(historyData)?.map((value, index) => <RowItem 
                key={index}
                header={config.headers.History?.[activeView]?.[index]} 
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
