import Button from 'components/Elements/Button';
import { DataState } from 'components/Tables/Elements/Values/DataState';
import React from 'react'

const PlatformClaim = ({claimData}) => {
    return (
        <div className="claim-component">
            <DataState value={claimData}>
                {claimData?.map(claim => <> 
                    <b>{claim.amount}</b>
                    <span>&nbsp;{claim.symbol} ({claim.totalAmount} {claim.symbol}) </span>
                    <Button className="claim-button" buttonText="Claim" onClick={() => {}} /> 
                </>)}
            </DataState>
        </div>
    )
}

export default PlatformClaim;