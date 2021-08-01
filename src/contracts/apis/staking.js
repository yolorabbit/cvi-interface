import { aprToAPY, convert, fromLPTokens, getChainName, getWeb3Contract, getBalance } from "contracts/utils";
import web3Api, { getTokenData } from "contracts/web3Api";
import { commaFormatted, customFixed, fromBN, toBN, toDisplayAmount, toFixed } from "utils";
import { chainNames } from '../../connectors';

const COTIData = { address: '0xDDB3422497E61e13543BeA06989C0789117555c5', symbol: 'COTI', decimals: 18 };
const RHEGIC2Data = { address: '0xAd7Ca17e23f13982796D27d1E6406366Def6eE5f', symbol: 'RHEGIC2', decimals: 18 };

const stakingApi = {
    getStakedAmountAndPoolShareByToken: async (contracts, asset, account) => {
        const {protocol, key: tokenName, fixedDecimals, rel, ...token} = asset
        
        if(protocol === "platform") {
            let tokenData;
            const getDataByTokenName = async () => {
                switch (tokenName) {
                    case 'govi':{
                        tokenData = await getTokenData(contracts.GOVI)
                        return web3Api.getStakedAmountAndPoolShareGOVI(contracts[rel.stakingRewards], account, token.decimals)
                    }
                    default: {
                        tokenData = await getTokenData(contracts[rel.token]);
                        return web3Api.getStakedAmountAndPoolShare(contracts[rel.stakingRewards], account, token.decimals)
                    }
                }
            }
            const data = await getDataByTokenName();
            const USDTData = await getTokenData(contracts.USDT);
            
            const getAmount = async () => tokenName === "govi" ? data.stakedTokenAmount : await fromLPTokens(contracts[rel.platform], toBN(data.stakedTokenAmount));
            const stakedAmountUSD = await convert(await getAmount(), tokenData, USDTData);

            return {
                ...data,
                stakedAmountUSD: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedAmountUSD.toString(), USDTData.decimals)), fixedDecimals))
            }
        } 
        return web3Api.getPoolSizeLiquidityMining(contracts, asset, account)
    },
    getPoolSizeLiquidityMining: async (contracts, asset, account, percentageDecimals=4) => {
        try {

            const {key: tokenName, fixedDecimals, rel, ...token} = asset
            const [stakingRewards, platformLPToken] = [contracts[rel.stakingRewards], contracts[rel.token]]
            const USDTData = await getTokenData(contracts.USDT);
            const GOVIData = await getTokenData(contracts.GOVI);
            const uniswapToken =  tokenName === "coti-eth-lp" ? COTIData : tokenName === "govi-eth-lp" ? GOVIData : RHEGIC2Data;
            const uniswapLPToken = await getTokenData(platformLPToken);
            const poolSize = await stakingRewards.methods.totalSupply().call();
            // console.log("poolSize: ", poolSize);
            const tvlUSD = await web3Api.uniswapLPTokenToUSD(poolSize, USDTData, uniswapLPToken, uniswapToken)
            // console.log(tokenName, protocol+" tvlUSD: ", tvlUSD);
            
            const totalStaked = !!account ? await stakingRewards.methods.balanceOf(account).call() : 0;
            // console.log("totalStaked: ", customFixed(toFixed(toDisplayAmount(totalStaked, token.decimals))));
            
            const accountStakedUSD = await web3Api.uniswapLPTokenToUSD(totalStaked, USDTData, uniswapLPToken, uniswapToken)
            // console.log(tokenName, protocol+" accountStakedUSD: ", accountStakedUSD);
            const mySharePercentage = totalStaked?.toString() === "0" ? toBN("0") : toBN(totalStaked).mul(toBN("1", token.decimals)).div(toBN(poolSize)).mul(toBN("100"));
            
            const data = {
                stakedTokenAmount: totalStaked,
                stakedAmount: commaFormatted(customFixed(toFixed(toDisplayAmount(totalStaked, token.decimals)), fixedDecimals)),
                poolSize: toBN(poolSize).isZero() ? "0" : commaFormatted(customFixed(toDisplayAmount(poolSize, token.decimals), fixedDecimals)),
                lastStakedAmount: {
                    class: mySharePercentage.gt(toBN("0")) ? 'high' : 'low',
                    value: `(${customFixed(toFixed(toDisplayAmount(mySharePercentage?.toString(), token.decimals)), percentageDecimals)}%)`
                },
                stakedAmountUSD: toBN(accountStakedUSD).isZero() ? "0" : `${commaFormatted(customFixed(toFixed(toDisplayAmount(accountStakedUSD)), 2))}`
            };
            
            const tvl = {
                stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(poolSize, token.decimals)), fixedDecimals)),
                stakedAmountUSD: toBN(poolSize).isZero() ? "0" : `$${commaFormatted(customFixed(tvlUSD, 2))}`
            }
            return {...data, tvl}
        } catch (error) {
            console.log('error: ', error);
        }
    },
    getStakedAmountAndPoolShare: async (stakingRewards, account, tokenDecimals, decimalsCountDisplay=8, percentageDecimals=4) => {
        const stakedTokenAmount = account ? await stakingRewards.methods.balanceOf(account).call() : 0;
        const poolSize = await stakingRewards.methods.totalSupply().call();
        const mySharePercentage = stakedTokenAmount === "0" ? toBN("0") : toBN(stakedTokenAmount).mul(toBN("1", tokenDecimals)).div(toBN(poolSize)).mul(toBN("100"));

        const lastStakedAmount = {
          class: mySharePercentage.gt(toBN("0")) ? 'high' : 'low',
          value: `(${customFixed(toFixed(toDisplayAmount(mySharePercentage?.toString(), tokenDecimals)), percentageDecimals)}%)`
        }
        
        return {
            stakedTokenAmount,
            stakedAmount: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedTokenAmount, tokenDecimals)), decimalsCountDisplay)),
            poolSize: toBN(poolSize).isZero() ? "0" : commaFormatted(customFixed(toFixed(toDisplayAmount(poolSize, tokenDecimals)), decimalsCountDisplay)),
            lastStakedAmount: {...lastStakedAmount}
        }
    },
    getStakedAmountAndPoolShareGOVI: async (staking, account, tokenDecimals, decimalsCountDisplay=8, percentageDecimals=4) => {
        const stakedTokenAmount = account ? await staking.methods.stakes(account).call() : 0;
        const poolSize = await staking.methods.totalStaked().call();
        const mySharePercentage = stakedTokenAmount?.toString() === "0" ? toBN("0") : toBN(stakedTokenAmount).mul(toBN("1", tokenDecimals)).div(toBN(poolSize)).mul(toBN("100"));

        const lastStakedAmount = {
          class: mySharePercentage.gt(toBN("0")) ? 'high' : 'low',
          value: `(${customFixed(toFixed(toDisplayAmount(mySharePercentage?.toString(), tokenDecimals)), percentageDecimals)}%)`
        }
        
        return {
            stakedTokenAmount,
            stakedAmount: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedTokenAmount, tokenDecimals)), decimalsCountDisplay)),
            poolSize: toBN(poolSize).isZero() ? "0" : commaFormatted(customFixed(toFixed(toDisplayAmount(poolSize, tokenDecimals)), decimalsCountDisplay)),
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
              "CVI-SHORT": "15839947089947089",
              "CVI-LP": "15839947089947089",
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
    getGOVIAPY: async function(staking, tokensData, USDTData, GOVIData, days, period) {

        try {
            async function getTotalProfits(token, events) {
                try {
                    const selectedNetwork = await getChainName();
                    let isETH = false;
                    if (token._address.toLowerCase() === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") isETH = true;
                    const _getWeb3Contract = await getWeb3Contract("ETHStakingProxy", selectedNetwork);
                    let initialValue = isETH ? toBN(await getBalance(_getWeb3Contract._address)): toBN(0);
                    // console.log(`initialValue ${initialValue}`);
                    return events.reduce((p, e) => p.add(toBN(e.returnValues ? e.returnValues[2] : e.tokenAmount)), initialValue);

                } catch(error) {
                    console.log(error);
                    return 0;
                }
            }

            async function getTokenYearlyProfitInUSD(tokenData, USDTData) {
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
            const apy = aprToAPY(apr);
            return apy / (365/period)
        } catch (error) {
            console.log(error);
            return 0;
        }
    },
    getDailyReward: async (stakingRewards, account, tokenDecimals, decimalsCountDisplay = 8) => {
        if(!account) return {
            amount: 0, 
            symbol: "GOVI"
        }
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
            amount: commaFormatted(customFixed(toFixed(toDisplayAmount(dailyRewards, tokenDecimals)), decimalsCountDisplay)),
            symbol: "GOVI",
        }
        return dailyReward
    },
    getDailyRewardPerToken: async function (staking, account, events, now, symbol, tokenDecimals, decimalsCountDisplay = 8) {
        if(!account) return {
            amount: 0,
            symbol
        }
        const sum = events.reduce((p, e) => p.add(toBN(e.returnValues ? e.returnValues[2] : e.tokenAmount)), toBN(0));
        const creationTimestamp = await staking.methods.creationTimestamp().call();
        const timePassedSinceCreation = now - creationTimestamp;
        const secondsInDay = 86400;
        const reward = sum.mul(toBN(secondsInDay)).div(toBN(timePassedSinceCreation));
        // console.log(`daily reward ${reward}`);

        let balance = await staking.methods.stakes(account).call();
        let total = await staking.methods.totalStaked().call();
        
        const dailyRewards = toBN(total).isZero() ? toBN(0) : reward.mul(toBN(balance)).div(toBN(total));

        const dailyReward = {
            amount: commaFormatted(customFixed(toFixed(toDisplayAmount(dailyRewards, tokenDecimals)), decimalsCountDisplay)),
            symbol,
        }
        return dailyReward
    },
    uniswapLPTokenToUSD: async (amount, USDTToken, uniswapLPToken, uniswapToken) => {
        let totalSupply = toBN(await uniswapLPToken.contract.methods.totalSupply().call());
        // console.log("totalSupply: " + totalSupply);
        if (totalSupply.isZero()) return 0;
        let token1 = await uniswapLPToken.contract.methods.token1().call();
        // let swapped = token1.toLowerCase() !== uniswapToken.address;
        let swapped = token1.toLowerCase() !== uniswapToken.address.toLowerCase();
    
        let reserves = await uniswapLPToken.contract.methods.getReserves().call();
        // console.log("reserves: " + JSON.stringify(reserves));
        let reserve0 = reserves[swapped ? "1" :"0"];
        // console.log("reserve0: " + reserve0);
        let reserve1 = reserves[swapped ? "0" :"1"];
        // console.log("reserve1: " + reserve1);
      
        let ETHValueInUSDFull = await convert(reserve0, undefined, USDTToken);
        // console.log("ETHValueInUSDFull: " + ETHValueInUSDFull);
        let ETHValueInUSD = toDisplayAmount(ETHValueInUSDFull, USDTToken.decimals);
        // console.log("ETHValueInUSD: " + ETHValueInUSD);
      
        let tokenValueInUSDFull = await convert(reserve1, uniswapToken, USDTToken);
        // console.log("tokenValueInUSDFull: " + tokenValueInUSDFull);
        let tokenValueInUSD = toDisplayAmount(tokenValueInUSDFull, USDTToken.decimals);
        // console.log("tokenValueInUSD: " + tokenValueInUSD);
      
        let totalSupplyTokens = toDisplayAmount(totalSupply, uniswapLPToken.decimals);
        // console.log("totalSupplyTokens: " + totalSupplyTokens);
      
        let totalValue = parseFloat(tokenValueInUSD) + parseFloat(ETHValueInUSD);
        // console.log("totalValue: " + totalValue);
      
        let lpTokenValue = totalValue / parseFloat(totalSupplyTokens);
        // console.log("lpTokenValue: " + lpTokenValue);
        let amountTokens = fromBN(amount, uniswapLPToken.decimals);
        // console.log("amountTokens: " + amountTokens);
        return amountTokens * lpTokenValue;
    },
    getUniswapAPY: async function(stakingRewards, USDTToken, GOVIData, uniswapLPToken, uniswapToken, isStaked) {
        // console.log("ETHToken: ", ETHToken);
        let rate = await stakingRewards.methods.rewardRate().call();
        // console.log(`reward rate ${rate}`);
        let total = await stakingRewards.methods.totalSupply().call();
        // console.log(`total ${total}`);
        
        const apyPeriods = isStaked ? [86400*365] : [86400*365, 86400*7, 86400];
        // const apyPeriods = [86400*365];
        const apysPeriods = [];
        
        for(const period of apyPeriods) {
            let periodRewards = toBN(period).mul(toBN(rate));
            // console.log(`GOVI periodRewards ${periodRewards}`);
            let USDPeriodRewards = toDisplayAmount(await convert(periodRewards, GOVIData, USDTToken), USDTToken.decimals);
            // console.log(`USDPeriodRewards ${USDPeriodRewards}`);
            
            // convert from coti/eth or govi/eth to USDT using uniswapLPTokenToUSD (cant use uniswap for this)
            let USDStakedTokens = await this.uniswapLPTokenToUSD(toBN(total), USDTToken, uniswapLPToken, uniswapToken);
            // console.log(`USDStakedTokens ${USDStakedTokens}`);
            const val = USDStakedTokens.toString() === "0" ? 0 : aprToAPY((USDPeriodRewards / USDStakedTokens) * 100, period);
            apysPeriods.push(val)
        }
        // console.log(apysPeriods);
        return apysPeriods
        
    },
    getClaimableRewards: async (contracts, asset, account) => {
        const {protocol, key: tokenName, rewardsTokens, fixedDecimals, rel} = asset
        if(protocol === "platform") {
            const getClaimableRewardsByTokenName = async () => {
                switch (tokenName) {
                  case 'govi':
                    return await rewardsTokens.map(async t => await contracts[rel.stakingRewards].methods.profitOf(account, contracts[t]._address).call());
                  default: 
                    return [await contracts[rel.stakingRewards].methods.earned(account).call()];
                }
            }
            const claim = await (await Promise.allSettled(await getClaimableRewardsByTokenName()))
            .filter(({status}) => status === "fulfilled")
            .map(({value}, idx) => ({
                amount: commaFormatted(customFixed(toFixed(toDisplayAmount(value, rel.tokenDecimals[idx])), fixedDecimals)),
                symbol: rewardsTokens[idx]
            }));
            
            return claim;
        }

        const rewards = await contracts[rel.stakingRewards].methods.earned(account).call();
        // console.log(tokenName, protocol+" rewards: ", rewards );
        const claim = [{
          amount: commaFormatted(customFixed(toFixed(toDisplayAmount(rewards, rel.tokenDecimals[0])), fixedDecimals)),
          symbol: rewardsTokens[0]
        }]

        return claim;
    },

}

export default stakingApi;