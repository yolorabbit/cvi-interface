import { useIsMobile, useIsTablet } from "components/hooks";
import { useMemo } from "react";
import RowItem from './RowItem';
import Value from '../Values/Value';
import config from "config/config";

const HistoryRow = ({token, isHeader, history = {
    date: "07/11/2020",
    type: "Liquidation",
    index: "77",
    amount: `1 ETH`,
    fees: `0.9 ETH`,
    netAmount: `0.1 ETH` }
}) => {
    const isTablet = useIsTablet();
    const isMobile = useIsMobile();

    const RowData = useMemo(() => (
        <> 
            {Object.values(history)?.filter((_history, i) => (!isTablet || (i !== 0 && i !== 1)))?.map((value, index) => <RowItem 
                key={index}
                header={config.headers.History?.filter((_history, i) => (!isTablet || (i !== 0 && i !== 1)))?.[index]} 
                content={<Value subText={value} />} 
            />)}
        </>
        //eslint-disable-next-line
    ), [token, isTablet, isMobile, history]);

    if(isHeader) {
        return <>
            <RowItem content={<Value text={history.date} /> } />
            <RowItem content={<Value text={history.type} /> } />
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default HistoryRow;
