import React, { useEffect, useState } from 'react';
import Expand from 'components/Expand';
import config from 'config/config';
import './ExpandList.scss';
import LiquidityRow from '../Rows/LiquidityRow';
import TradeRow from '../Rows/TradeRow';
import HistoryRow from '../Rows/HistoryRow';
import { uniqueId } from 'lodash';
import Paginator from 'components/Paginator';

const ExpandList = ({activeTab, data = [], pageSize = 5 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const showPaginator = data.length > pageSize;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const renderView = (token, isHeader) => {
        switch(activeTab) {
            case config.tabs.trade.positions:
                return <TradeRow isHeader={isHeader} token={token} />
            case config.tabs['view-liquidity'].liquidity:
                return  <LiquidityRow isHeader={isHeader} token={token} />
            default:
                return <HistoryRow token={token} isHeader={isHeader} />
        }
    }

    return (
        <div className={`expand-list-component ${activeTab?.toLowerCase()}`}>
            {currentData.map(token => <Expand 
                key={uniqueId(token)} 
                header={renderView(token, true)} 
                expandedView={renderView(token)} 
            />)}

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

export default ExpandList;