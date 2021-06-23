import React from 'react';
import Expand from 'components/Expand';
import config from 'config/config';
import './ExpandList.scss';
import LiquidityRow from '../Rows/LiquidityRow';
import TradeRow from '../Rows/TradeRow';

const ExpandList = ({activeTab}) => {
    const isPositions = activeTab === config.tabs.trade.positions;

    return (
        <div className="expand-list-component">
            {config.tokens.map(item => <Expand 
                key={item} 
                header={isPositions ? <TradeRow isHeader token={item} /> : <LiquidityRow isHeader token={item} />} 
                expandedView={isPositions ? <TradeRow token={item} /> : <LiquidityRow token={item} />} 
            />)}
        </div>
    )
}

export default ExpandList;