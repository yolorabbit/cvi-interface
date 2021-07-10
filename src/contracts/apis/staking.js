import BigNumber from "bignumber.js";
import { aprToAPY, convert, fromLPTokens, getChainName, getWeb3Contract, getBalance } from "contracts/utils";
import { commaFormatted, customFixed, toBN, toDisplayAmount } from "utils";

const stakingApi = {
    getStakedAmountAndPoolShare: async (stakingRewards, account, tokenDecimals, decimalsCountDisplay=8, percentageDecimals=4) => {
        const stakedTokenAmount = await stakingRewards.methods.balanceOf(account).call();
        const poolSize = await stakingRewards.methods.totalSupply().call();
        const mySharePercentage = toBN(poolSize).isZero() ? toBN("0") : BigNumber(stakedTokenAmount).dividedBy(BigNumber(poolSize)).multipliedBy(BigNumber(100));
        const lastStakedAmount = {
          class: mySharePercentage < 0 ? 'low' : 'high',
          value: `(${customFixed(mySharePercentage, percentageDecimals)}%)`
        }
        
        return {
            stakedTokenAmount,
            stakedAmount: commaFormatted(customFixed(toDisplayAmount(stakedTokenAmount, tokenDecimals), decimalsCountDisplay)),
            poolSize: toBN(poolSize).isZero() ? "0" : commaFormatted(customFixed(toDisplayAmount(poolSize, tokenDecimals), decimalsCountDisplay)),
            lastStakedAmount: {...lastStakedAmount}
        }
    },
    getStakedAmountAndPoolShareGOVI: async (staking, account, tokenDecimals, decimalsCountDisplay=8, percentageDecimals=4) => {
        const stakedTokenAmount = await staking.methods.stakes(account).call();
        const poolSize = await staking.methods.totalStaked().call();
        const mySharePercentage =  BigNumber(stakedTokenAmount).dividedBy(BigNumber(poolSize)).multipliedBy(BigNumber(100));

        const lastStakedAmount = {
          class: mySharePercentage < 0 ? 'low' : 'high',
          value: `(${customFixed(mySharePercentage, percentageDecimals)}%)`
        }
        
        return {
            stakedTokenAmount,
            stakedAmount: commaFormatted(customFixed(toDisplayAmount(stakedTokenAmount, tokenDecimals), decimalsCountDisplay)),
            poolSize: toBN(poolSize).isZero() ? "0" : commaFormatted(customFixed(toDisplayAmount(poolSize, tokenDecimals), decimalsCountDisplay)),
            lastStakedAmount: {...lastStakedAmount}
        }
    },
    getAPYPerToken: async (platform, stakingRewards, USDTData, GOVIData, tokenData, period = 31536000, enforceMax = false) => {
        try {
          const cname = await platform.methods.name().call();
          let rate = await stakingRewards.methods.rewardRate().call();
          // console.log(`enforceMax ? ${enforceMax}, name: ${cname} reward rate ${rate}`);
          
          const maxRateConfig = {
              "USDT-LP": "10615079365079365",
              "USDT-LP-V2": "15839947089947089",
              "ETH-LP-V2": "18750000000000000",
          }
      
          if(!enforceMax && toBN(rate).gt(toBN(maxRateConfig[cname]))) {
              rate = maxRateConfig[cname];
          }
      
          let total = await stakingRewards.methods.totalSupply().call();
          // console.log(`total ${total}`);
          let yearlyReward = toBN(period).mul(toBN(rate));
          // console.log(`GOVI yearlyReward ${yearlyReward}`);
          let USDYearlyReward = toDisplayAmount(await convert(yearlyReward, GOVIData, USDTData), USDTData.decimals);
          // console.log(`USDYearlyReward ${USDYearlyReward}`);
          // convert from USDT-LP to USDT
          let stakedTokens = await fromLPTokens(platform, toBN(total));
          // console.log(`stakedTokens ${stakedTokens}`);
          // console.log(`stakedTokens converted ${await convert(stakedTokens, tokenData, USDTData, chainId, library.currentProvider)}`);
          let USDStakedTokens = toDisplayAmount(await convert(stakedTokens, tokenData, USDTData), USDTData.decimals);
          // console.log(`USDStakedTokens ${USDStakedTokens}`);
          
          return USDStakedTokens === 0 ? 0 : aprToAPY((USDYearlyReward / USDStakedTokens) * 100);
       
      
        } catch(error) {
            console.log(error);
            return 0;
        }
    },
    getGOVIAPY: async function(staking, tokensData, USDTData, GOVIData, days = 30) {

        try {
            async function getTotalProfits(token, events, days = 30) {
                try {
                    const selectedNetwork = await getChainName();
                    let isETH = false;
                    if (token._address.toLowerCase() === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") isETH = true;
                    let initialValue = isETH ? toBN(await getBalance(getWeb3Contract("ETHStakingProxy", selectedNetwork)._address)): toBN(0);
                    // console.log(`initialValue ${initialValue}`);
                    // console.log(events);
                    return events.reduce((p, e) => p.add(toBN(selectedNetwork === "Matic" ? e.tokenAmount : e.returnValues[2])), initialValue);

                } catch(error) {
                    console.log(error);
                    return 0;
                }
            }

            async function getTokenYearlyProfitInUSD(tokenData, USDTData, days = 30) {
                // console.log(`checking relative to the last ${days} days`);
                const DAY = 86400;
                const YEAR = DAY*365;
                try {
                    // console.log(`checking relative to the last ${days} days`);
                    const totalProfits = await getTotalProfits(tokenData.contract, tokenData.events, days);
                    // console.log(`totalProfits ${totalProfits}`);
                    const yearlyProfits = toBN(totalProfits)
                      .mul(toBN(YEAR))
                      .div(toBN(DAY * days));
                    // console.log(`yearlyProfits ${yearlyProfits}`);
                    let USDYearlyProfits = (await convert(yearlyProfits, tokenData, USDTData)).div(toBN(1).pow(toBN(USDTData.decimals)));
                    // console.log(`USDYearlyProfits ${USDYearlyProfits}`);
                    return USDYearlyProfits;
                } catch(error) {
                    console.log(error);
                    return 0;
                }
            }

            async function getAPR() {
               // yearly profits = totalProfits * seconds in year / time since contract creation
                // APR = value of (yearly profits) / value of (total staked GOVI) * 100
                let USDYearlyProfits = toBN("0");
                for (const tokenData of tokensData) {
                    USDYearlyProfits = USDYearlyProfits.add(await getTokenYearlyProfitInUSD(tokenData, USDTData, days));
                }
                USDYearlyProfits = toBN(USDYearlyProfits, USDTData.decimals);
                // console.log(`USDYearlyProfits ${USDYearlyProfits.toString()}`);
                const totalStaked = await staking.methods.totalStaked().call();
                // console.log(`totalStaked ${totalStaked}`);
                let USDTotalStaked = (await convert(totalStaked, GOVIData, USDTData))
                // console.log(`USDTotalStaked ${USDTotalStaked}`);
                // console.log(toDisplayAmount(USDYearlyProfits.div(USDTotalStaked).mul(toBN("100")), USDTData.decimals));

                if (USDTotalStaked.isZero()) return toBN("0");
                return toDisplayAmount(USDYearlyProfits.div(USDTotalStaked).mul(toBN("100")), USDTData.decimals);
            }
            const apr = await getAPR();
            // console.log(apr.toString());
            return aprToAPY(apr, days);
        } catch (error) {
            console.log(error);
            return 0;
        }
    },
    getDailyReward: async (stakingRewards, account, tokenDecimals, decimalsCountDisplay = 8) => {
        let rate = await stakingRewards.methods.rewardRate().call();
        let total = toBN(await stakingRewards.methods.totalSupply().call());
        if(toBN(total).isZero()) return total;
        let balance = await stakingRewards.methods.balanceOf(account).call();

        let rewardPerDayPerToken = toBN(86400)
            .mul(toBN(rate))
            .mul(toBN(10).pow(toBN(tokenDecimals)))
            .div(toBN(total));

        const dailyRewards = toBN(balance).isZero() ? toBN(balance) 
            : toBN(balance)
            .mul(rewardPerDayPerToken)
            .div(toBN(10).pow(toBN(tokenDecimals)));
        
        const dailyReward = {
            amount: commaFormatted(customFixed(toDisplayAmount(dailyRewards, tokenDecimals), decimalsCountDisplay)),
            symbol: "GOVI",
        }
        return dailyReward
    },
    getDailyRewardPerToken: async function (staking, account, events, now, symbol, tokenDecimals, decimalsCountDisplay = 8) {
        const selectedNetwork = await getChainName();
        const sum = events.reduce((p, e) => p.add(toBN(selectedNetwork === "Matic" ? e.tokenAmount : e.returnValues[2] )), toBN(0));
        const creationTimestamp = await staking.methods.creationTimestamp().call();
        const timePassedSinceCreation = now - creationTimestamp;
        const secondsInDay = 86400;
        const reward = sum.mul(toBN(secondsInDay)).div(toBN(timePassedSinceCreation));
        // console.log(`daily reward ${reward}`);

        let balance = await staking.methods.stakes(account).call();
        let total = await staking.methods.totalStaked().call();
        
        const dailyRewards = toBN(total).isZero() ? toBN(0) : reward.mul(toBN(balance)).div(toBN(total));

        const dailyReward = {
            amount: commaFormatted(customFixed(toDisplayAmount(dailyRewards, tokenDecimals), decimalsCountDisplay)),
            symbol,
        }
        return dailyReward
    },
}

export default stakingApi;