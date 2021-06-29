import React, { useContext, useEffect, useState } from 'react';
import Expand from 'components/Expand';
import { uniqueId } from 'lodash';
import Paginator from 'components/Paginator';
import platformConfig from 'config/platformConfig';
import { platformViewContext } from 'components/Context';
import stakingConfig from 'config/stakingConfig';
import ActiveRow from '../Elements/Rows/ActiveRow';
import './ExpandList.scss';

const ExpandList = ({activeTab, data = [], pageSize = 5, showPaginator }) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);
    const currentData = showPaginator ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : data;
    const _showPaginator = showPaginator && data.length > pageSize;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    if(!activeTab || 
        (activeView && !platformConfig.headers?.[activeView]?.[activeTab]) ||
        (!activeView && !stakingConfig.headers?.[activeTab])) return null;

    return (
        <div className={`expand-list-component ${activeTab?.toLowerCase()}`}>
            {currentData.map(rowData => <Expand 
                key={uniqueId()} 
                header={<ActiveRow rowData={rowData} activeTab={activeTab} isHeader />} 
                expandedView={<ActiveRow rowData={rowData} activeTab={activeTab} />} 
            />)}

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

export default ExpandList;