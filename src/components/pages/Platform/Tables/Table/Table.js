import config from 'config/config';
import React from 'react';
import LiquidityRow from '../Rows/LiquidityRow';
import TradeRow from '../Rows/TradeRow';
import './Table.scss';

const Table = ({activeTab}) => {
    const tableHeaders = ["", ...Object.values(config.headers?.[activeTab]), ""];

    return (
        <div className="table-component">
            <table>
                <thead>
                    <tr>
                        {tableHeaders?.map((item, index) => <th key={index}>{item?.label}</th>)}
                    </tr>
                </thead>

                <tbody>
                    {config.tokens.map(token => <TableRow activeTab={activeTab} key={token} token={token} />)}
                </tbody>
            </table>
        </div>
    )
}

const TableRow = ({token, activeTab}) => {
    return activeTab === config.tabs.trade.positions ? <TradeRow token={token} /> : <LiquidityRow token={token} />
}

export default Table;