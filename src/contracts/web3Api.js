import { customFixed, toBN, toDisplayAmount, toFixed } from "utils";
import { convert, getPrice, getChainName, getBalance, fromLPTokens } from './utils';
import * as TheGraph from 'graph/queries';
import config from "config/config";
import positionApi from "./apis/position";
import stakingApi from "./apis/staking";
import rewardsApi from './apis/rewards';
import liquidityApi from "./apis/liquidity";
import moment from "moment";
import { chainNames } from "connectors";
import platformConfig from "config/platformConfig";
import stakingConfig, { stakingProtocols } from "config/stakingConfig";
import { bottomBlockByNetwork, maticBottomBlockSinTheGraphStopToWork } from "components/Hooks/useEvents";
import Api from "Api";
 
export const getLatestBlockTimestamp = async(getBlock) => (await getBlock("latest")).timestamp

const findTokenByAddress = (tokens = [], address = "") => Object.values(tokens).find((token) => {
    return (token.address && token.address.toLowerCase() === address.toLowerCase());
})

export const getTokenData = async (contract, protocol) => {
    if(!contract) return null;
    const { address, network } = contract.options;

    const tokensJsonConfig = {...stakingConfig.tokens[network][protocol], ...platformConfig.tokens[network]}
    let tokenData = findTokenByAddress(tokensJsonConfig, address); 

    if(tokenData) {
        const { decimals, key, address} = tokenData;
        return { address, symbol: key === "eth" ? "WETH" : key?.toUpperCase(), decimals, contract };
    }
    
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
 
    return { address, symbol, decimals, contract };
}

export async function getFeesCollectedFromEvents(staking, USDTData, tokensData, { eventsUtils, library, useInitialValue }) {
    const selectedNetwork = await getChainName();
    const bottomBlock = selectedNetwork === chainNames.Matic ? maticBottomBlockSinTheGraphStopToWork :  bottomBlockByNetwork[selectedNetwork]; // temporary fix for matic
    const options = {
        steps: Number.MAX_SAFE_INTEGER,
        bottomBlock: bottomBlock, 
        stepSize: 2000, 
    }

    let usdSum = toBN((selectedNetwork === chainNames.Matic && useInitialValue) ? "131007869134" : "0");

    for (let i = 0; i < tokensData.length; i++) {
        const token = tokensData[i].contract;
        const tokenData = tokensData[i];
        const to = tokenData.symbol === "WETH" ? "dst" : "to";
        const eventsData = [{ contract: token, events: { Transfer: [{ [to]: staking._address }] } }];
        const events = await eventsUtils.getEvents(eventsData, options, library.eth.getBlock);
        // console.log("events: ", events);
        // sum of transfer events from the last SAMPLE_DAYS days
        const sum = events.reduce((p, e) => p.add(toBN(e.returnValues[2])), toBN(0));
        // console.log(`sum ${toDisplayAmount(sum, tokenData.decimals)} ${tokenData.symbol}`);
        usdSum = usdSum.add(await convert(sum, tokenData, USDTData));
    }
    return toDisplayAmount(usdSum, USDTData.decimals);
}

const getFeesCollectedFromGraph = async (USDTData, tokensData) => {
    let res = await TheGraph.collectedFeesSum();
    const includeUSDC = tokensData.some(token => token.symbol === "USDC");
    if(includeUSDC) {
        let usdc_res = await TheGraph.collectedFeesSumUSDC();
        res.collectedFeesAggregations = res.collectedFeesAggregations.concat(usdc_res.collectedFeesAggregations);
    }
    // console.log(`res collectedFees size ${res.collectedFees.length}`);
    let sum = toBN(0);
    for (const token of tokensData.filter(item => item !== null)) {
      //console.log(`token ${token.symbol}`);
      let filtered = res.collectedFeesAggregations.filter((e) => e.id.toLowerCase() === token.address.toLowerCase());
      //console.log(`filtered ${filtered.length}`);
      let tokenSum = filtered.reduce((p, e) => p.add(toBN(e.sum)), toBN(0));
      //console.log(`tokenSum ${tokenSum} ${token.symbol}`);
      let tokenSumUSD = await convert(tokenSum, token, USDTData);
      //console.log(`tokenSumUSD ${tokenSumUSD} ${USDTData.symbol}`);
      sum = sum.add(tokenSumUSD);
    }
    //console.log(`graph sum $${toDisplayAmount(sum, USDTData.decimals)}`);
    return toDisplayAmount(sum, USDTData.decimals);
}

const getFeesCollectedFromApi = async (USDTData, tokensData, chainName) => {
    let res = await Api.GET_FEES_COLLECTED();
    let feesCollectedResult = [];

    if(chainName === chainNames.Matic) {
        feesCollectedResult = res.data['Polygon'];
    } else feesCollectedResult = res.data[chainName];
    feesCollectedResult = Object.keys(feesCollectedResult).map(key => ({[key]: feesCollectedResult[key]}));
    // console.log(feesCollectedResult);

    // console.log(`res collectedFees size ${res.collectedFees.length}`);
    let sum = toBN(0);
    for (const token of tokensData.filter(item => item !== null)) {
    //   console.log(`token ${token.symbol}`);
      let filteredToken = feesCollectedResult.filter((e) => e[token.symbol.toUpperCase()])[0];
    //   console.log(`filtered`, filteredToken);
      let tokenSum = filteredToken[token.symbol.toUpperCase()];
    //   console.log(`tokenSum ${tokenSum} ${token.symbol}`);
      let tokenSumUSD = await convert(tokenSum, token, USDTData);
    //   console.log(`tokenSumUSD ${tokenSumUSD} ${USDTData.symbol}`);
      sum = sum.add(tokenSumUSD);
    }
    return toDisplayAmount(sum, USDTData.decimals);
}

export async function getFeesCollected(USDTData, tokensData) {
    const chainName = await getChainName();
    if(chainName === chainNames.Matic) {
        return await getFeesCollectedFromApi(USDTData, tokensData, chainName)
    } else {
        return await getFeesCollectedFromGraph(USDTData, tokensData);
    }
}

const web3Api = {
    getPlatformBalance: async (contracts, tokens = [], {library}) => {
        try {
            const USDTData = await getTokenData(contracts["USDT"]);
            
            const promiseList = tokens.map(async ({rel: { platform, contractKey}, key, fixedDecimals}) => {
                const tokenData = await getTokenData(contracts[contractKey]);

                let totalBalance = toBN(
                    key === 'eth' ? await library.eth.getBalance(contracts[platform]._address) : 
                    key === "usdc" ? await toBN(await contracts[platform].methods.totalLeveragedTokensAmount().call()) :
                    await contracts[contractKey].methods.balanceOf(contracts[platform]._address).call()
                )

                const amountConverted = await convert(totalBalance, tokenData, USDTData)
                return [
                    `${customFixed(toDisplayAmount(amountConverted.toString(), USDTData.decimals), fixedDecimals)} (${key.toUpperCase()} pool)`, 
                    amountConverted,
                    key
                ]
            });

            const result = await (await Promise.allSettled(promiseList))
                            .filter(({status}) => status === "fulfilled")
                            .map(({value}) => value)

            return result;
        } catch(error) {
            console.log(error);
            return "N/A"
        }
    },
    getLiquidityPoolsBalance: async (contracts, tokens = []) => {
        try {
            const USDTData = await getTokenData(contracts["USDT"]);
            
            const promiseList = tokens.map(async ({rel: { platform, contractKey}, key}) => {
                const tokenData = await getTokenData(contracts[contractKey]);
                const value = await contracts[platform].methods.totalBalanceWithAddendum().call();
                const amountConverted = await convert(toBN(value), tokenData, USDTData);
                const amountFormatted  = customFixed(toDisplayAmount(amountConverted.toString(), USDTData.decimals), 2)
                return [`${amountFormatted} (${key.toUpperCase()} pool)`, amountConverted, key];
            });

            const result = await (await Promise.allSettled(promiseList))
                            .filter(({status}) => status === "fulfilled")
                            .map(({value}) => value);

            return result
        } catch(error) {
            console.log(error);
            return "N/A";
        }
    },
    getGoviPrice: async ({GOVI, USDC, USDT}) => {
        try {
            const chainName = await getChainName();
            const GOVIData = await getTokenData(GOVI, stakingProtocols.platform);
            const TokenData = await getTokenData(chainName === chainNames.Matic ? USDC : USDT);
            const goviPrice = await getPrice(GOVIData, TokenData);
            return goviPrice;
        } catch(error) {
            console.log(error);
            return "N/A"
        }
    },
    getFeesCollected: async (contracts, tokens) => {
        try {
            const USDTData = await getTokenData(contracts.USDT);
            const tokensData = [];
            for(let token of tokens) {
                tokensData.push(await getTokenData(contracts[token.rel.contractKey]));
            }
            const totalFeesCollected = await getFeesCollected(USDTData, tokensData);
            return customFixed(totalFeesCollected, 2);
        } catch(error) {
            console.log(error);
            return "N/A"
        }
    },
    getTotalGoviRewards: async (contracts) => { // @TODO: use promise all setteled
        try {
            const chainName = await getChainName();
            const PositionRewards = contracts[config.contractsMapped?.[chainName]?.["PositionRewards"]];
            const PositionRewardsV2 = contracts[config.contractsMapped?.[chainName]?.["PositionRewardsV2"] ?? "PositionRewardsV2"];
            const USDCPositionRewards = contracts[config.contractsMapped?.[chainName]?.["USDCPositionRewards"] ?? "USDCPositionRewards"];

            let usdtMaxPositionRewards = toBN("0"), 
            ethMaxPositionRewards = toBN("0"),
            usdcMaxPositionRewards = toBN("0"),
            errorCounter = 0;

            try {
                usdtMaxPositionRewards = await PositionRewards.methods.maxDailyReward().call();
            } catch(error) {
                errorCounter++;
            }

            try {
                ethMaxPositionRewards = await PositionRewardsV2.methods.maxDailyReward().call();
            } catch(error) {
                errorCounter++;
            }

            try {
                usdcMaxPositionRewards = await USDCPositionRewards.methods.maxDailyReward().call();
            } catch (error) {
                errorCounter++;
            }

            return errorCounter < 2 ? toBN(usdcMaxPositionRewards).add(toBN(usdtMaxPositionRewards)).add(toBN(ethMaxPositionRewards)).toString() : "N/A";
        } catch(error) {
            console.log(error);
            return "N/A";
        }
    },
    getCollateralRatio: async (contracts, token, {library}) => {
        try {
            let platformBalance;
            if(token.key === "eth") {
                platformBalance = toBN(await library.eth.getBalance(contracts[token.rel.platform].options.address));
            } else if(token.key === "usdc") {
                platformBalance = toBN(await contracts[token.rel.platform].methods.totalLeveragedTokensAmount().call());
            } else {
                platformBalance = toBN(await contracts[token.rel.contractKey].methods.balanceOf(contracts[token.rel.platform].options.address).call());
            }

            let totalPositionUnitsAmount = toBN(await contracts[token.rel.platform].methods.totalPositionUnitsAmount().call());
            let decimals = toBN(await contracts[token.rel.platform].methods.PRECISION_DECIMALS().call());
            let collateralRatio = platformBalance.toString() !== "0" ? totalPositionUnitsAmount.mul(decimals).div(platformBalance) : toBN("0");
            
            return {
                collateralRatio,
                currentRatioValue: totalPositionUnitsAmount,
                platformBalance
            }
        } catch (error) {
            console.log(error);
            return "N/A";
        }
    },
    getAvailableBalance: async (contracts, token, {account, type, withStakeAmount, library}) => {
        try {
            if(type === "sell") {
                let positionValue = await contracts[token.rel.platform].methods.calculatePositionBalance(account).call();
                return positionValue.currentPositionBalance;
            }

            if(type === "withdraw") {
                if(withStakeAmount) {
                    const stakedAmount = toBN(await contracts[token.rel.stakingRewards].methods.balanceOf(account).call())
                    let lpBalance = toBN(await contracts[token.rel.platform].methods.balanceOf(account).call());
                    const maxTokenBalance = await fromLPTokens(contracts[token.rel.platform], lpBalance);

                    if(stakedAmount) {
                        lpBalance = lpBalance.add(stakedAmount);
                    }
    
                    const totalSupply = toBN(await contracts[token.rel.platform].methods.totalSupply().call());
                    const totalBalance = toBN(await contracts[token.rel.platform].methods.totalBalanceWithAddendum().call());
                    const tokenAmount = totalSupply !== 0 ? lpBalance.mul(totalBalance).div(totalSupply) : toBN(0);
                    let sharePercent = totalSupply !== 0 ? toFixed((library.utils.fromWei(lpBalance, "ether") / library.utils.fromWei(totalSupply, "ether")) * 100) : 0;
                    
                    return {myShare: tokenAmount?.toString(), poolShare: sharePercent, maxTokenBalance: maxTokenBalance?.toString()};
                }

                const lpBalance = toBN(await contracts[token.rel.platform].methods.balanceOf(account).call());
                const lpTokensBalance = await fromLPTokens(contracts[token.rel.platform], lpBalance);

                return lpTokensBalance;
            }

            const tokenData = await getTokenData(contracts[token.rel.contractKey]);
            const balance = await getBalance(account, token.key !== "eth" && tokenData.address);
            return balance;
        } catch(error) {
            console.log(error);
            return type !== "withdraw" ? "0" : {myShare: "0", poolShare: "0"}
        }
    },
    isLocked: async function(contracts, token, { type, customDuration, account, library, eventsUtils }) {
        try {
            let openTime;
            if(type === "sell"){
                let event = await eventsUtils.getLastOpenEvent(account, token);
                if(!event) return [0,0];
                let block = await new Promise((res, rej)=> library.eth.getBlock(event.blockNumber, (err, data) => err ? rej(err) : res(data)));
                if(!block) return [0,0];
                openTime = (block.timestamp * 1000);
            }
            
            if(type === "withdraw") { 
                openTime = await contracts[token.rel.platform].methods.lastDepositTimestamp(account).call() * 1000;
            }

            if(type === "unstake") {
                openTime = Number(await contracts[token.rel.stakingRewards].methods.stakeTimestamps(account).call()) * 1000
            }

            const lock = await contracts[type === "unstake" ? token.rel.stakingRewards : token.rel.platform].methods[config.lockupPeriod[type]]().call();
            const latestBlockTimestamp = await getLatestBlockTimestamp(library.eth.getBlock) * 1000;
            const lockedTime = moment.utc(openTime).add(lock, 'seconds').valueOf() - latestBlockTimestamp;
            
            let customDurationTime;
            if(customDuration) {
                customDurationTime = moment.utc(openTime).add(customDuration, 'seconds').valueOf() - latestBlockTimestamp;
            }
            
            return [lockedTime > 0, customDurationTime ?? lockedTime];
        } catch(error) {
            console.log(error);
            return "N/A";
        }
    },
    ...positionApi,
    ...stakingApi,
    ...rewardsApi,
    ...liquidityApi,
}

export default web3Api;