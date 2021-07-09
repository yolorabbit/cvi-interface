import Button from 'components/Elements/Button';
import React from 'react'

const StakingClaim = ({claim}) => {
    return (
        <div className="claim-component">
            <b>{`${claim.amount} ${claim.symbol }`}</b>
            <span>&nbsp;</span>
            <Button className="claim-button" buttonText="Claim" onClick={() => {}} /> 
        </div>
    )
}

export default StakingClaim;