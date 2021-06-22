import config from 'config/config';
import React from 'react';
import { LiquidityRow } from './Rows/LiquidityRow';
import { TradeRow } from './Rows/TradeRow';
import './Table.scss';

const tokens = ["usdt", "eth"];

const headers = {
    [config.tabs.trade.positions]:  ["", "Value", "P&L", "Rewards (claimable today)", "Leverage", "Estimated Liquidation", ""],
    [config.tabs['view-liquidity'].liquidity]:  ["", "My liquidity (pool share)", "P&L", "Pool size", ""]
};

const Table = ({activeTab}) => {
    return (
        <div className="table-component">
            <table>
                <thead>
                    <tr>
                        {headers?.[activeTab]?.map((item, index) => <th key={index}>{item}</th>)}
                    </tr>
                </thead>

                <tbody>
                    {tokens.map(token => <TableRow activeTab={activeTab} key={token} token={token} />)}
                </tbody>
            </table>
        </div>
    )
}

const TableRow = ({token, activeTab}) => {
    return activeTab === config.tabs.trade.positions ? <TradeRow token={token} /> : <LiquidityRow token={token} />
}

export default Table;