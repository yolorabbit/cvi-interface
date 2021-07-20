import Button from 'components/Elements/Button';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import config from 'config/config';
import stakingConfig from 'config/stakingConfig';
import { contractsContext } from 'contracts/ContractContext';
import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import { toBN, gas } from 'utils';
import Rewards from './../Tables/Elements/Values/Rewards';


const StakingClaim = ({tokenName, protocol, claim, submitted}) => {
    const disabled = claim.some(rewards => toBN(rewards).gt(toBN(0)));
    const dispatch = useDispatch();
    const { account } = useActiveWeb3React()
    const contracts = useContext(contractsContext);
    const { selectedNetwork } = useSelector(({app}) => app); 
    const token = stakingConfig.tokens[selectedNetwork][protocol][tokenName];
    
    const onClick = async () => {
        try {
            dispatch(addAlert({
                id: 'claim',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));
            await contracts[token.rel.stakingRewards].methods[tokenName ==='govi' ? "claimAllProfits" : "getReward"]().send({from: account, ...gas});
            dispatch(addAlert({
                id: 'claim',
                eventName: `Claim ${token.label ?? token.rewardsTokens[0]} reward- success`,
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success"
            }));
        } catch (error) {
            dispatch(addAlert({
                id: 'claim',
                eventName: `Claim ${token.label ?? token.rewardsTokens[0]} reward- failed`,
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
            console.log(error);
        }
    }
    
    return (
        <div className="claim-component">
            <div className="claim-component__container">
                <Rewards rewards={claim} />
                <div className="claim-component__container--action">
                    <Button disabled={disabled} className="claim-button" buttonText="Claim" onClick={onClick} /> 
                </div>
            </div>
        </div>
    )
}

export default StakingClaim;