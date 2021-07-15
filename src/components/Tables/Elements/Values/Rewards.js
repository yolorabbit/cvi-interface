import React, { useMemo } from 'react'
import Value from './Value';

const Rewards = ({rewards = []}) => {
    return useMemo(() => {
        return (
            <div className="rewards-component">
                {rewards !== "N/A" && rewards.map(({amount, symbol}) => <Value key={symbol} text={amount} subText={symbol} />)}
            </div>
        )
    }, [rewards]);
}

export default Rewards;