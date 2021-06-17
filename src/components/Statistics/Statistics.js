import Stat from 'components/Stat/Stat'
import React from 'react'
import './Statistics.scss';
const Statistics = () => {
    return (
        <div className="statistics-component">
            <div className="statistics-component__container">
                <Stat name="totalValueLocked" value="5,951,118,71.12" />

                <Stat name="liquidityPoolBalance" values={["3,379,840.94 (USDT pool)", "2,316,739.83 (ETH pool)"]} />

                <Stat name="openTrades" values={["88,121.72 (USDT pool)", "166,416.22 (ETH pool)"]} />
                <div className="statistics-component__container--breaker"></div>
                <Stat name="goviPrice" value="3.32" />

                <Stat name="feesCollected" value="185,795.07" />

                <Stat name="totalGoviRewards" value="5,400" />
            </div>
        </div>
    )
}

export default Statistics;