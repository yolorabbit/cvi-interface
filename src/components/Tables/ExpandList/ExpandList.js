import React, { useContext, useMemo } from 'react';
import Expand from 'components/Expand';
import { uniqueId } from 'lodash';
import Paginator from 'components/Paginator';
import ActiveRow from '../Elements/Rows/ActiveRow';
import SubHeader from '../Elements/SubHeader';
import './ExpandList.scss';
import { useDataController } from '../DataController/DataController';
import { platformViewContext } from 'components/Context';

const ExpandList = () => {
    const { 
        currentData,
        currentPage,
        showPaginator,
        setCurrentPage,
        totalRecords,
        pageSize,
        activeTab,
        subHeaders
    } = useDataController();

    const { activeView } = useContext(platformViewContext);

    return useMemo(() => {
        return (
            <div className={`expand-list-component ${activeTab?.toLowerCase()}`}>
                {currentData.map((rowData, index) => [
                        subHeaders?.[index] && <SubHeader key={uniqueId()} title={subHeaders[index]} />, 
                        <Expand 
                            key={uniqueId()} 
                            header={<ActiveRow rowData={rowData} activeTab={activeTab} isHeader />} 
                            expandedView={<ActiveRow rowData={rowData} activeTab={activeTab} />} 
                        />
                    ])
                }
             
                {showPaginator && <Paginator 
                    currentPage={currentPage} 
                    totalRecords={totalRecords} 
                    onFirstClick={() => setCurrentPage(1)}
                    onLastClick={(last) => setCurrentPage(last)}
                    onBackClick={() => setCurrentPage(currentPage - 1)}
                    onFwdClick={() => setCurrentPage(currentPage + 1)}
                    pgSize={pageSize}
                    numOfpageBtndsToDispay={0}
                />}
            </div>
        )
        //eslint-disable-next-line
    }, [currentPage, activeTab, activeView])
    
    
}

export default ExpandList;