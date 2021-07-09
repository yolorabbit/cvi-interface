import BigNumber from "bignumber.js";
import { aprToAPY, convert, fromLPTokens } from "contracts/utils";
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
    }
}

export default stakingApi;