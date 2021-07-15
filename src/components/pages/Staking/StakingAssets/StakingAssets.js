import { useIsTablet } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import stakingApi from 'contracts/apis/staking';
import { contractsContext } from 'contracts/ContractContext';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { toBN } from 'utils';
import './StakingAssets.scss';

const StakingAssets = ({type}) => {
    const isTablet = useIsTablet();
    const { selectedNetwork } = useSelector(({app}) => app);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const contracts = useContext(contractsContext);
    const { account } = useActiveWeb3React();

    const getAssets = () => {
        const liquidityMiningProtocols = stakingConfig.tokens[selectedNetwork];
        const liquidityMiningProtocolsValues = Object.values(liquidityMiningProtocols);
        const liquidityMiningTokens = liquidityMiningProtocolsValues.map(protocol => Object.values(protocol));
        const stakingAssetsData = liquidityMiningTokens.reduce((prev, next) => prev.concat(next));
        return stakingAssetsData
    }

    useEffect(() => {
        let canceled = false
        const dataFilteringByTokenRole = async (cb) => {
            let assets = getAssets();
            if(type === "staked") {
                if(!contracts || !account) return [];

                assets = assets.map(async asset => {
                    let staked = await stakingApi.getStakedAmountAndPoolShareByToken(contracts, asset, account);
                    const claim = await stakingApi.getClaimableRewards(contracts, asset, account);
                    return {...asset, data: {staked, claim} };
                })

                assets = await Promise.all(assets);
                assets = assets.filter(({data: {staked, claim}}) => {
                    const stakedTokenAmount = staked.stakedTokenAmount ?? 0
                    const hasStaked = toBN(stakedTokenAmount).gt(toBN(0));
                    const canClaim = claim?.some(({tokenAmount}) => tokenAmount && toBN(tokenAmount).gt(toBN(0)));
                    const shouldFiltered = !hasStaked && !canClaim
                    return !shouldFiltered
                })
            }
            
            cb(() => setFilteredAssets(assets));
        }

        dataFilteringByTokenRole((cb)=>{
            if(canceled) return
            cb()
        });

        return () => {
            canceled = true;
        }
    //eslint-disable-next-line
    },[contracts, account]);


    return useMemo(() => {
        

        return (
            <div className="staked-assets-component">
                <DataController
                    activeTab={type} 
                    data={filteredAssets} 
                    showPaginator={type === stakingViews.staked} 
                    authGuard={type === stakingViews.staked}
                    subHeaders={stakingConfig.tableSubHeaders[type]}
                >
                    {isTablet ? <ExpandList /> : <Table />}
                </DataController>
            </div>
        ) //eslint-disable-next-line
    }, [isTablet, selectedNetwork, filteredAssets]);
}

export default StakingAssets;