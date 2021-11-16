import Button from 'components/Elements/Button';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import config from 'config/config';
import stakingConfig from 'config/stakingConfig';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import { actionConfirmEvent, gas } from 'utils';
import Contract from 'web3-eth-contract';
import Rewards from './../Tables/Elements/Values/Rewards';


const StakingClaim = ({tokenName, protocol, claim }) => {
    const isValid = claim.some(({amount}) => amount.replace(",","") !== "0");
    const dispatch = useDispatch();
    const { account, library } = useActiveWeb3React()
    const { selectedNetwork } = useSelector(({app}) => app); 
    const token = stakingConfig.tokens[selectedNetwork][protocol][tokenName];
    
    const getContract = (contractKey) => {
        const contractsJSON = require(`../../contracts/files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${selectedNetwork}.json`);
        const { abi, abiRef, address } = contractsJSON[contractKey];
        const _contract = new Contract(abi || contractsJSON[abiRef].abi, address);
        _contract.setProvider(library?.currentProvider);
        return _contract
    }

    const onClick = async () => {
        const _contract = getContract(token.rel.stakingRewards);
        try {
            dispatch(addAlert({
                id: 'claim',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));
            await _contract.methods[tokenName ==='govi' ? "claimAllProfits" : "getReward"]().send({from: account, ...gas});
            dispatch(addAlert({
                id: 'claim',
                eventName: `Claim ${token.label ?? token.rewardsTokens[0]} reward- success`,
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success"
            }));

            actionConfirmEvent(dispatch);
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
                    <Button disabled={!isValid} className="claim-button" buttonText="Claim" onClick={onClick} /> 
                </div>
            </div>
        </div>
    )
}

export default StakingClaim;