import Button from 'components/Elements/Button';
import React from 'react'
import Rewards from './../Tables/Elements/Values/Rewards';

const StakingClaim = ({claim}) => {
    
    // <b>{`${claim[0].amount} ${claim[0].symbol }`}</b>
    //         <span>&nbsp;</span>
    return (
        <div className="claim-component">
            <div className="claim-component__container">
                <Rewards rewards={claim} />
                <div className="claim-component__container--action">
                    <Button className="claim-button" buttonText="Claim" onClick={() => {}} /> 
                </div>
            </div>
        </div>
    )
}

export default StakingClaim;