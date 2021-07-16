import { contractsContext } from "contracts/ContractContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useActiveWeb3React } from "./wallet";
import stakingApi from 'contracts/apis/staking';
import { toBN } from 'utils';
import stakingConfig from "config/stakingConfig";
import { useSelector } from "react-redux";
import platformConfig from "config/platformConfig";
import web3Api from "contracts/web3Api";

const useAssets = (type, update) => {
    const { account, library } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const [filteredAssets, setFilteredAssets] = useState(null);
    const { selectedNetwork } = useSelector(({app}) => app);
    const eventsUpdateRef = useRef(null);
    const { positions, liquidities } = useSelector(({wallet}) => wallet);

    const getAssets = () => {
        const stakingAssets = () => {
            let liquidityMiningProtocols = stakingConfig.tokens[selectedNetwork];
            let liquidityMiningProtocolsValues = Object.values(liquidityMiningProtocols);
            let liquidityMiningTokens = liquidityMiningProtocolsValues.map(protocol => Object.values(protocol));
            let stakingAssetsData = liquidityMiningTokens.reduce((prev, next) => prev.concat(next));
            return stakingAssetsData
        }
        
        const platformAsset = () => Object.values(platformConfig.tokens[selectedNetwork]).filter(token => !token.soon)

        switch (type) {
            case "staked":
                return stakingAssets();
            case "available-to-stake":
                return stakingAssets();
            case "Open trades": 
                return platformAsset();
            case "Liquidity": 
                return platformAsset();
            default:
                return [];
        }

    }
    
    const filter = async () =>{
        let filteredAssets = getAssets();
        switch (type) {
            case "staked": {
                filteredAssets = filteredAssets.map(async asset => {
                    let staked = await stakingApi.getStakedAmountAndPoolShareByToken(contracts, asset, account);
                    const claim = await stakingApi.getClaimableRewards(contracts, asset, account);
                    return {...asset, data: {staked, claim} };
                })
                filteredAssets = await Promise.all(filteredAssets);
                return filteredAssets.filter(({data: {staked, claim}}) => {
                    const stakedTokenAmount = staked.stakedTokenAmount ?? 0
                    const hasStaked = toBN(stakedTokenAmount).gt(toBN(0));
                    const canClaim = claim?.some(({tokenAmount}) => tokenAmount && toBN(tokenAmount).gt(toBN(0)));
                    const shouldFiltered = !hasStaked && !canClaim
                    return !shouldFiltered
                })
            }
            case "Open trades": {
                filteredAssets = filteredAssets.map(async asset => {
                    const positionValue = await web3Api.getAvailableBalance(contracts, asset, {library, account, type: "sell", errorValue: "0" } );
                    return {...asset, data: { positionValue } };
                })
                filteredAssets = await Promise.all(filteredAssets);
                filteredAssets = filteredAssets.filter(({data: {positionValue}}) => toBN(positionValue).gt(toBN(0)));
                return filteredAssets
            }

            case "Liquidity": {
                filteredAssets = filteredAssets.map(async asset => {
                    const data = await web3Api.getAvailableBalance(contracts, asset, {account, library, withStakeAmount: true, type: "withdraw"});
                    return {...asset, data };
                })
                filteredAssets = await Promise.all(filteredAssets);
                return filteredAssets.filter(({data: {myShare}}) => toBN(myShare).gt(toBN(0)) )
            }
        
            default:
                return filteredAssets;
        }
    }

    const dataFiltering = async (cb) => {
        if(!contracts || !account) return [];
        let filteredAssets = await filter();
        cb(() => setFilteredAssets(filteredAssets));
    }

    useEffect(() => {
        if(!!filteredAssets?.length) {
            setFilteredAssets(null)
        }
        let canceled = false

        dataFiltering((cb)=>{
            if(canceled) return
            cb()
        });

        return () => {
            canceled = true;
        }
    //eslint-disable-next-line
    },[contracts, account, type, update]);

    useEffect(() => {
        if(type === "Open trades") {
            let canceled = false
            eventsUpdateRef.current = setTimeout(() => {
                    dataFiltering((cb)=>{
                    if(canceled) return
                    cb()
                });
            }, 1000);
        }
        return () => {
            if(eventsUpdateRef.current) clearTimeout(eventsUpdateRef.current);
        }
        //eslint-disable-next-line
    }, [positions?.length]);

    useEffect(() => {
        if(type === "Liquidity") {
            if(!liquidities?.length > 0) return;
            let canceled = false
            eventsUpdateRef.current = setTimeout(() => {
                dataFiltering((cb)=>{
                    if(canceled) return
                    cb()
                });
            }, 1000);
        }
        return () => {
            if(eventsUpdateRef.current) clearTimeout(eventsUpdateRef.current);
        }
        //eslint-disable-next-line
    }, [liquidities?.length]);

    return filteredAssets;
}

export default useAssets;