import { useIsTablet } from "components/Hooks";
import { useContext, useMemo } from "react";
import RowItem from './RowItem';
import { appViewContext } from "components/Context";
import platformConfig from "config/platformConfig";
import { Value } from "../Values";
import { omit } from "lodash";

const HistoryRow = ({rowData, isHeader}) => {
    const isTablet = useIsTablet();
    const { activeView } = useContext(appViewContext); 
    const headers = useMemo(() => Object.values(platformConfig.headers?.[activeView]?.History), [activeView]);
    
  
    const RowData = useMemo(() => {
        if(!rowData || !activeView || !headers) return null;
        const historyData = omit(rowData, ['transactionHash', 'timestamp']);

        return (
            <> 
                {Object.values(historyData)?.map((value, index) => <RowItem 
                    key={index}
                    header={headers[index]} 
                    content={<Value subText={value} />} 
                />)}
            </>
            //eslint-disable-next-line
        )
    }, [rowData, activeView, headers]);

    if(isHeader) {
        return <>
            <RowItem content={<Value text={rowData.date} /> } />
            <RowItem content={<Value text={rowData.type} /> } />
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default HistoryRow;
