import { useIsLaptop } from 'components/Hooks';
import Stat from 'components/Stat/Stat'
import commonApi from 'contracts/commonApi';
import { useWeb3Api } from 'contracts/useWeb3Api';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import { customFixed, toDisplayAmount } from 'utils';
import './Statistics.scss';

const Statistics = () => {
    const { selectedNetwork } = useSelector(({app}) => app)
    const isLaptop = useIsLaptop();
    const platformBalance = useWeb3Api("getPlatformBalance");
    const liquidityPools = useWeb3Api("getLiquidityPoolsBalance");
    const goviPrice = useWeb3Api("getGoviPrice");
    const feesCollected = useWeb3Api("getFeesCollected");
    const totalGoviRewards = useWeb3Api("getTotalGoviRewards");

    return useMemo(() => {
        const _openTrades = () => {
            if(!liquidityPools || !platformBalance) return null;
            if(liquidityPools?.length !== platformBalance?.length) return "N/A";
            if(liquidityPools === "N/A" || platformBalance === "N/A") return "N/A";
            return platformBalance?.map((item, index) => `${commonApi.getTradersPoolSize(item[1], liquidityPools[index][1])} (${item[2]?.toUpperCase()} pool)`)
        }
        const openTrades = _openTrades(); // calculate open trades for active tokens
        const platformBalanceReduced = platformBalance !== "N/A" && platformBalance?.length > 1 ? platformBalance?.reduce((a, b) => a[1].add(b[1])) : platformBalance?.[0]?.[1]; // sum active tokens tvl

        return  (
            <div key={selectedNetwork} className="statistics-component">
                <div className="statistics-component__container">
                    <Stat 
                        name="totalValueLocked" 
                        value={platformBalanceReduced}
                        format={customFixed(toDisplayAmount(platformBalanceReduced, 6), 2)}
                    />
    
                    <Stat name="liquidityPoolBalance" values={liquidityPools !== "N/A" && liquidityPools !== null ? liquidityPools?.map(item => item[0]) : liquidityPools} />
    
                    <Stat name="openTrades" values={openTrades} />
                    {isLaptop && <div className="statistics-component__container--breaker"></div>}
                    <Stat 
                        name="goviPrice" 
                        value={goviPrice} 
                        format={customFixed(goviPrice, 2)}
                    />
    
                    <Stat name="feesCollected" value={feesCollected} />
    
                    <Stat 
                        name="totalGoviRewards" 
                        value={totalGoviRewards}
                        format={customFixed(toDisplayAmount(totalGoviRewards?.toString(), 18), 2)}
                    />
                </div>
            </div>
        )
    }, [isLaptop, platformBalance, liquidityPools, goviPrice, feesCollected, totalGoviRewards, selectedNetwork]);
}

export default Statistics;