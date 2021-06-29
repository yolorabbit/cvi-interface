import { platformViewContext } from 'components/Context';
import Paginator from 'components/Paginator';
import Tooltip from 'components/Tooltip';
import platformConfig from 'config/platformConfig';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import { uniqueId } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import ActiveRow from '../Elements/Rows/ActiveRow';
import './Table.scss';


const Table = ({activeTab, data = [], pageSize = 5}) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);
    
    if(!activeTab || 
        (activeView && !platformConfig.headers?.[activeView]?.[activeTab]) ||
        (!activeView && !stakingConfig.headers?.[activeTab])) return null;

    const tableHeaders = stakingViews[activeTab] ? Object.values(stakingConfig.headers?.[activeTab]) :  Object.values(platformConfig.headers?.[activeView]?.[activeTab]);
    const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const showPaginator = data.length > pageSize;

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
                    {currentData.map(rowData => <ActiveRow key={uniqueId()} activeTab={activeTab} rowData={rowData}  />)}
                </tbody>
            </table>

            {showPaginator && <Paginator 
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

export default Table;