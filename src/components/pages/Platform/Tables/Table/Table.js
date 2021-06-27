import { platformViewContext } from 'components/Context';
import Paginator from 'components/Paginator';
import config from 'config/config';
import { uniqueId } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import HistoryRow from '../Rows/HistoryRow';
import LiquidityRow from '../Rows/LiquidityRow';
import TradeRow from '../Rows/TradeRow';
import './Table.scss';

const Table = ({activeTab, data = [], pageSize = 5}) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);
    const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const showPaginator = data.length > pageSize;

    const tableHeaders = activeTab === "History" ? 
        Object.values(config.headers?.[activeTab]?.[activeView]) : 
        ["", ...Object.values(config.headers?.[activeTab]), ""];

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);


    return (
        <div className={`table-component ${activeTab?.toLowerCase()}`}>
            <table>
                <thead>
                    <tr>
                        {tableHeaders?.map((item, index) => <th key={index}>{item?.label ?? item}</th>)}
                    </tr>
                </thead>

                <tbody>
                    {currentData.map(token => <TableRow key={uniqueId(token)} activeTab={activeTab} token={token} />)}
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

const TableRow = ({token, activeTab}) => {
    if(activeTab === "History") {
        return <HistoryRow token={token} />
    }
    return activeTab === config.tabs.trade.positions ? <TradeRow token={token} /> : <LiquidityRow token={token} />
}

export default Table;