import { useIsTablet } from "components/Hooks";
import { useContext, useMemo } from "react";
import RowItem from './RowItem';
import { platformViewContext } from "components/Context";
import platformConfig from "config/platformConfig";
import { Value } from "../Values";

const HistoryRow = ({rowData, isHeader}) => {
    const isTablet = useIsTablet();
    const { activeView } = useContext(platformViewContext); 
    const headers = useMemo(() => Object.values(platformConfig.headers?.[activeView]?.History), [activeView]);
    
    const RowData = useMemo(() => {
        if(!rowData || !activeView || !headers) return null;
        return (
            <> 
                {Object.values(rowData)?.map((value, index) => <RowItem 
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
