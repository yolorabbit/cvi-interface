import { customFixed, toBN, toDisplayAmount } from "utils";
import { convert, getPrice, getChainName, getBalance } from './utils';
import * as TheGraph from 'graph/queries';
import config from "config/config";
import positionApi from "./apis/position";
import stakingApi from "./apis/staking";
import rewardsApi from './apis/rewards';
import liquidityApi from "./apis/liquidity";
import moment from "moment";

export async function getLastOpenEvent(platformAddress, account) {
    let _lastOpenEvent = await TheGraph.lastOpen(account, platformAddress);
    return !!_lastOpenEvent.openPositions?.length ? _lastOpenEvent.openPositions[0] : null;
}

export const getLatestBlockTimestamp = async(getBlock) => (await getBlock("latest")).timestamp

export const getTokenData = async (contract) => {
    if(!contract) return null;
    const address = await contract.options.address;
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    return { address, symbol, decimals, contract };
}

export async function getFeesCollected(USDTData, tokensData) {
    let res = await TheGraph.collectedFees();
    //console.log(res);
    //console.log(`res collectedFees size ${res.collectedFees.length}`);
    let sum = toBN(0);
    for (const token of tokensData.filter(item => item !== null)) {
      //console.log(`token ${token.symbol}`);
      let filtered = res.collectedFees.filter((e) => e.tokenAddress.toLowerCase() === token.address.toLowerCase());
      //console.log(`filtered ${filtered.length}`);
      let tokenSum = filtered.reduce((p, e) => p.add(toBN(e.tokenAmount)), toBN(0));
      //console.log(`tokenSum ${tokenSum} ${token.symbol}`);
      let tokenSumUSD = await convert(tokenSum, token, USDTData);
      //console.log(`tokenSumUSD ${tokenSumUSD} ${USDTData.symbol}`);
      sum = sum.add(tokenSumUSD);
    }
    //console.log(`graph sum $${toDisplayAmount(sum, USDTData.decimals)}`);
    return toDisplayAmount(sum, USDTData.decimals);
}


const web3Api = {
    getPlatformBalance: async (contracts, tokens = [], {library}) => {
        try {
            const USDTData = await getTokenData(contracts["USDT"]);
            
            const promiseList = tokens.map(async ({rel: { platform, contractKey}, key, fixedDecimals}) => {
                const tokenData = await getTokenData(contracts[contractKey]);
                const balance = key === "eth" ? 
                await library.eth.getBalance(contracts[platform].options.address) 
                : toBN(await (await contracts[contractKey].methods.balanceOf(contracts[platform].options.address).call()));

                const amountConverted = await convert(balance, tokenData, USDTData)
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
    getGoviPrice: async ({GOVI, USDT}) => {
        try {
            const GOVIData = await getTokenData(GOVI);
            const USDTData = await getTokenData(USDT);
            const goviPrice = await getPrice(GOVIData, USDTData);
            return goviPrice;
        } catch(error) {
            console.log(error);
            return "N/A"
        }
    },
    getFeesCollected: async ({USDT, WETH}) => {
        try {
            const USDTData = await getTokenData(USDT);
            const tokensData = [USDTData, await getTokenData(WETH)];
            const totalFeesCollected = await getFeesCollected(USDTData, tokensData);
            return customFixed(totalFeesCollected, 2);
        } catch(error) {
            console.log(error);
            return "N/A"
        }
    },
    getTotalGoviRewards: async (contracts) => { // @TODO: use promise all
        try {
            const chainName = await getChainName();
            const PositionRewards = contracts[config.contractsMapped?.[chainName]?.["PositionRewards"]];
            const PositionRewardsV2 = contracts[config.contractsMapped?.[chainName]?.["PositionRewardsV2"] ?? "PositionRewardsV2"];

            let usdtMaxPositionRewards = toBN("0"), 
            ethMaxPositionRewards = toBN("0"),
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

            return errorCounter < 2 ? toBN(usdtMaxPositionRewards).add(toBN(ethMaxPositionRewards)).toString() : "N/A";
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
            } else {
                platformBalance = toBN(await contracts[token.rel.contractKey].methods.balanceOf(contracts[token.rel.platform].options.address).call());
            }
    
            let totalPositionUnitsAmount = toBN(await contracts[token.rel.platform].methods.totalPositionUnitsAmount().call());
            let decimals = toBN(await contracts[token.rel.platform].methods.PRECISION_DECIMALS().call());
            let collateralRatio = platformBalance.toString() !== "0" ? totalPositionUnitsAmount.mul(decimals).div(platformBalance) : 0;
            
            return {
                collateralRatio,
                currentRatioValue: totalPositionUnitsAmount,
                platformBalance
            }
        } catch (error) {
            console.log(error);
            return {
                collateralRatio: "N/A",
                currentRatioValue: "N/A",
                platformBalance: "N/A"
            }
        }
    },
    getAvailableBalance: async (contracts, token, {account, type}) => {
        try {
            if(type === "sell") {
                let positionValue = await contracts[token.rel.platform].methods.calculatePositionBalance(account).call();
                return positionValue.currentPositionBalance;
            }

            const tokenData = await getTokenData(contracts[token.rel.contractKey]);
            const balance = await getBalance(account, token.key !== "eth" && tokenData.address);
            return balance;
        } catch(error) {
            console.log(error);
            return "N/A";
        }
    },
    isLocked: async function(contracts, token, { type, customDuration, account, library }) {
        try {
            let openTime;

            console.log(type);
            console.log(token);
            console.log(account);
            console.log(library);

            if(type === "sell"){
                let event = await getLastOpenEvent(contracts[token.rel.platform]._address, account);
                if(!event) return [0,0];
                let block = await new Promise((res, rej)=> library.eth.getBlock(event.blockNumber, (err, data) => err ? rej(err) : res(data)));
                if(!block) return [0,0];
                openTime = (block.timestamp * 1000);
            }
            
            if(type === "withdraw") { 
                openTime = await contracts[token.rel.platform].methods.lastDepositTimestamp(account).call() * 1000;
            }
            
            const lock = await contracts[token.rel.platform].methods[config.lockupPeriod[type]]().call();
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