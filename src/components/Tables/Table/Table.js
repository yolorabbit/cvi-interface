import { platformViewContext } from 'components/Context';
import { useIsTablet } from 'components/hooks';
import Paginator from 'components/Paginator';
import Tooltip from 'components/Tooltip';
import platformConfig from 'config/platformConfig';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ActiveRow from '../Elements/Rows/ActiveRow';
import './Table.scss';


const Table = ({activeTab, data = [], pageSize = 5, subHeaders = {}, showPaginator = true}) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);
    
    if(!activeTab || 
        (activeView && !platformConfig.headers?.[activeView]?.[activeTab]) ||
        (!activeView && !stakingConfig.headers?.[activeTab])) return null;

    const tableHeaders = stakingViews[activeTab] ? Object.values(stakingConfig.headers?.[activeTab]) :  Object.values(platformConfig.headers?.[activeView]?.[activeTab]);
    const currentData = showPaginator ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : data;
    const _showPaginator = showPaginator && data.length > pageSize;

    return (
        <div className={`table-component ${activeTab?.toLowerCase()}`}>
            <table>
                <thead>
                    <tr>
                        {tableHeaders?.map((item, index) => 
                            <th 
                                key={index}
                            >
                                {item?.label ?? item} 
                                {item?.tooltip && <Tooltip 
                                                    type="question" 
                                                    left={item?.tooltip?.left ?? -30} 
                                                    mobileLeft={item?.tooltip?.mobileLeft} 
                                                    maxWidth={400} 
                                                    minWidth={250} 
                                                    content={item?.tooltip?.content} 
                                                />}
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>
                
                    {currentData.map((rowData, index) => {
                        return [
                        subHeaders?.[index] && <SubHeader title={subHeaders[index]} />,
                        <ActiveRow key={index} activeTab={activeTab} rowData={rowData}  
                    />]
                    })}
                </tbody>
            </table>

            {_showPaginator && <Paginator 
                currentPage={currentPage} 
                totalRecords={data.length} 
                onFirstClick={() => setCurrentPage(1)}
                onLastClick={(last) => setCurrentPage(last)}
                onBackClick={() => setCurrentPage(currentPage - 1)}
                onFwdClick={() => setCurrentPage(currentPage + 1)}
                pgSize={pageSize}
                numOfpageBtndsToDispay={0}
            />}
        </div>
    )
}

const SubHeader = ({title}) => {
    const isTablet = useIsTablet();

    return useMemo(() => {
        return <tr className="sub-header-component">
            <td>{title}</td>
        </tr>
        //eslint-disable-next-line
    }, [isTablet]) 
}

export default Table;