import React, { useContext, useEffect, useState } from 'react';
import Expand from 'components/Expand';
import { uniqueId } from 'lodash';
import Paginator from 'components/Paginator';
import platformConfig from 'config/platformConfig';
import { platformViewContext } from 'components/Context';
import stakingConfig from 'config/stakingConfig';
import ActiveRow from '../Elements/Rows/ActiveRow';
import SubHeader from '../Elements/SubHeader';
import ConnectWallet from '../../ConnectWallet/ConnectWallet';
import './ExpandList.scss';

const ExpandList = ({activeTab, data = [], subHeaders = {}, pageSize = 5, authGuard = true, showPaginator }) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);
    const currentData = showPaginator ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : data;
    const _showPaginator = showPaginator && data.length > pageSize;
    const account = "";
    const activeTabLabel = stakingConfig.stakingConnectLabels?.[activeTab] ?? activeTab?.toLowerCase();

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    if(!account && authGuard) return <ConnectWallet type="table expand-list-component" buttonText={`to view ${activeTabLabel}`} />

    if(!activeTab || 
        (activeView && !platformConfig.headers?.[activeView]?.[activeTab]) ||
        (!activeView && !stakingConfig.headers?.[activeTab])) return null;

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