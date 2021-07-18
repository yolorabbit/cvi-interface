import Spinner from 'components/Spinner/Spinner';
import React, { useMemo } from 'react'
import Value from './Value';

const Rewards = ({rewards = []}) => {
    return useMemo(() => {
        if(rewards === null) return <Spinner className="statistics-spinner claim-spinner" />
        return (
            <div className="rewards-component">
                {rewards !== "N/A" && rewards.map(({amount, symbol}) => <Value key={symbol} text={amount} subText={symbol === "WETH" ? "ETH" : symbol} />)}
            </div>
        )
    }, [rewards]);
}

export default Rewards;