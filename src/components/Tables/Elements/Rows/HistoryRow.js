import { useIsTablet } from "components/Hooks";
import { useContext, useMemo } from "react";
import RowItem from './RowItem';
import { platformViewContext } from "components/Context";
import platformConfig from "config/platformConfig";
import { Value } from "../Values";
import { useDataController } from "components/Tables/DataController/DataController";

const HistoryRow = ({isHeader}) => {
    const { currentData, currentPage } = useDataController();
    const isTablet = useIsTablet();
    const { activeView } = useContext(platformViewContext); 
    const headers = useMemo(() => Object.values(platformConfig.headers?.[activeView]?.History), [activeView]);
    
    console.log(currentData);

    const RowData = useMemo(() => {
        if(!currentData[currentPage]?.length || !activeView || !headers) return null;
        return (
            <> 
                {currentData[currentPage]?.map((value, index) => <RowItem 
                    key={index}
                    header={headers[index]} 
                    content={<Value subText={value} />} 
                />)}
            </>
            //eslint-disable-next-line
        )
    }, [currentData[currentPage], activeView, headers]);

    if(isHeader) {
        return <>
            <RowItem content={<Value text={currentData[currentPage].date} /> } />
            <RowItem content={<Value text={currentData[currentPage].type} /> } />
        </>
    }

    return isTablet ? RowData : <tr>
        {RowData}
    </tr>
}

export default HistoryRow;
