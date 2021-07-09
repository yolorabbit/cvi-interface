import Button from 'components/Elements/Button';
import React from 'react'

const StakingClaim = ({claim}) => {
    
    // Staking GOVI rewards in USDT & ETH
    // TODO: support multi tokens rewards (UI - data exist on claim prop as array)
    // TMP: claim[0]

    return (
        <div className="claim-component">
            <b>{`${claim[0].amount} ${claim[0].symbol }`}</b>
            <span>&nbsp;</span>
            <Button className="claim-button" buttonText="Claim" onClick={() => {}} /> 
        </div>
    )
}

export default StakingClaim;