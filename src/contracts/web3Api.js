import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { contractsContext } from "./ContractContext";
import platformConfig from '../config/platformConfig';
import { customFixed, toBN, toDisplayAmount } from "utils";
import { useActiveWeb3React } from "components/Hooks/wallet";
import { convert, getPrice, getChainName } from './utils';
import * as TheGraph from 'graph/queries';

export const getTokenData = async (contract) => {
    console.log(contract);
    const address = await contract.options.address;
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    return { address, symbol, decimals, contract };
}

export async function getFeesCollected(staking, USDTData, tokens, tokensData, library) {
    let res = await TheGraph.collectedFees();
    //console.log(res);
    //console.log(`res collectedFees size ${res.collectedFees.length}`);
    let sum = toBN(0);
    for (const token of tokensData) {
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
    getPlatformBalance: async (contracts, tokens = [], library) => {
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
    getFeesCollected: async (contracts, tokens) => {
        try {
            const USDTData = await getTokenData(contracts["USDT"]);
            const ETHData = await getTokenData(contracts["WETH"]);
            const tokens = [contracts["USDT"], contracts["WETH"]];
            const tokensData = ETHData ? [USDTData, ETHData] : [USDTData];
            const totalFeesCollected = await getFeesCollected(contracts["Staking"], USDTData, tokens, tokensData);

            return customFixed(totalFeesCollected, 2);
        } catch(error) {
            console.log(error);
            return "N/A"
        }
    },
    getTotalGoviRewards: async (contracts) => {
        try {
            const chainName = await getChainName();
            const PositionRewards = contracts[platformConfig.contractsMapped?.[chainName]?.["PositionRewards"] ?? "PositionRewards"];
            const PositionRewardsV2 = contracts[platformConfig.contractsMapped?.[chainName]?.["PositionRewardsV2"] ?? "PositionRewardsV2"];

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
}

export const useTokensApi = (type) => {
    const { library } = useActiveWeb3React();
    const { selectedNetwork } = useSelector(({app}) => app);
    const contracts = useContext(contractsContext);
    const [data, setData] = useState();
    
    useEffect(() => {
        if(!selectedNetwork || !contracts || !library?.currentProvider) return null;
        const tokens = Object.values(platformConfig.tokens[selectedNetwork]).filter(({soon}) => !soon);

        if(web3Api[type]) {
            web3Api[type](contracts, tokens, library).then(data => {
                setData(data);
            }).catch(error => {
                console.log(error);
                setData("N/A");
            });
        } else setData("N/A");

    }, [selectedNetwork, contracts, library, type]);

    return data

}

export default web3Api;