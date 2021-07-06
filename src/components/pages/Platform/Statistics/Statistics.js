import { useIsLaptop } from 'components/Hooks';
import Stat from 'components/Stat/Stat'
import commonApi from 'contracts/commonApi';
import React, { useMemo } from 'react'
import { customFixed, toDisplayAmount } from 'utils';
import { useTokensApi } from '../../../../contracts/web3Api';
import './Statistics.scss';

const Statistics = () => {
    const isLaptop = useIsLaptop();
    const platformBalance = useTokensApi("getPlatformBalance");
    const liquidityPools = useTokensApi("getLiquidityPoolsBalance");
    const goviPrice = useTokensApi("getGoviPrice");
    const feesCollected = useTokensApi("getFeesCollected");
    const totalGoviRewards = useTokensApi("getTotalGoviRewards");
    console.log(feesCollected);

    return useMemo(() => {
        const _openTrades = () => {
            if(!liquidityPools || !platformBalance) return null;
            if(liquidityPools?.length !== platformBalance?.length) return "N/A";
            return platformBalance?.map((item, index) => `${commonApi.getTradersPoolSize(item[1], liquidityPools[index][1])} (${item[2]?.toUpperCase()} pool)`)
        }
        const openTrades = _openTrades(); // calculate open trades for active tokens
        const platformBalanceReduced = platformBalance?.length > 0 && platformBalance?.reduce((a, b) => a[1].add(b[1])); // sum active tokens tvl

        return  (
            <div className="statistics-component">
                <div className="statistics-component__container">
                    <Stat 
                        name="totalValueLocked" 
                        value={platformBalanceReduced}
                        format={customFixed(toDisplayAmount(platformBalanceReduced, 6), 2)}
                    />
    
                    <Stat name="liquidityPoolBalance" values={liquidityPools?.map(item => item[0])} />
    
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
    }, [isLaptop, platformBalance, liquidityPools, goviPrice, feesCollected, totalGoviRewards]);
}

export default Statistics;