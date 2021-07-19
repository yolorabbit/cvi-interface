import Spinner from 'components/Spinner/Spinner';
import React, { useMemo } from 'react'
import Value from './Value';

const Rewards = ({rewards = []}) => {

    return useMemo(() => {
        if(rewards === null) return <Spinner className="statistics-spinner claim-spinner" />
        const claimableToday = (symbol, totalAmount) => `${symbol === "WETH" ? "ETH" : symbol} ${totalAmount ? `(${totalAmount} ${symbol})` : ''}`;

        return (
            <div className="rewards-component">
                {rewards !== "N/A" && rewards.map(({amount, symbol, totalAmount}) => <Value key={symbol} text={amount} subText={claimableToday(symbol, totalAmount)} />)}
            </div>
        )
    }, [rewards]);
}

export default Rewards;