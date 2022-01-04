import { useContext, useEffect, useMemo, useState } from "react";
import { contractsContext } from "contracts/ContractContext";
import { stakingViewContext } from "components/Context";
import stakingConfig, { stakingProtocols } from 'config/stakingConfig';
import { commaFormatted, customFixed, toBN, toDisplayAmount, toFixed } from "utils";
import web3Api, { getTokenData } from "contracts/web3Api";
import { aprToAPY, convert, fromLPTokens, getPrice } from "contracts/utils";
import { DAY, useEvents } from "../useEvents";
import { useActiveWeb3React } from "../wallet";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import config from "config/config";

const initialState = {
  stakedTokenAmount: null,
  stakedAmount: null,
  stakedAmountUSD: null,
  lastStakedAmount: {
    class: null,
    value: null
  },
  poolSize: null,
  apy: [null,null,null],
  claim: [{
    amount: null,
    symbol: null
  }],
  status: null,
  tvl: {
    stakedAmountLP: null,
    stakedAmountUSD: null
  },
  balance: {
    tokenBalance: null,
    usdBalance: null,
    formatted: null
  }
}

export const pairsData = {
  "COTI": { address: '0xDDB3422497E61e13543BeA06989C0789117555c5', symbol: 'COTI', decimals: 18 },
  "RHEGIC2": { address: '0xAd7Ca17e23f13982796D27d1E6406366Def6eE5f', symbol: 'RHEGIC2', decimals: 18 }
}

const useStakedData = (chainName, protocol, tokenName, isStaked) => {
  const contracts = useContext(contractsContext);
  const { account } = useActiveWeb3React();
  const { library } = useWeb3React(config.web3ProviderId);
  const { selectedNetwork } = useSelector(({app}) => app);
  const { w3 } = useContext(stakingViewContext);
  const [stakedData, setStakedData] = useState(initialState);
  const eventsUtils = useEvents();
  const token = stakingConfig.tokens[chainName]?.[protocol]?.[tokenName];
  const isTokenGOVI = useMemo(() => (
    tokenName === stakingConfig.tokens[selectedNetwork]["platform"]["govi-v1"]?.key || tokenName === stakingConfig.tokens[selectedNetwork]["platform"]["govi-v2"]?.key
  ), [selectedNetwork, tokenName]);
  const tokenRel = token?.rel;
  const decimalsCountDisplay = 8;
  const events = useSelector(({events})=> events);
  
  const getAPY = async (cb) => {
    if (token.overrideApy !== undefined) {
      cb(() => setStakedData((prev)=> ({
        ...prev,
        apy: [token.overrideApy, token.overrideApy, token.overrideApy].map((value) => value ? `${customFixed(value, 2)}%` : "N/A")
      })));
      return;
    }

    const [platform, stakingRewards] = [contracts[tokenRel.platform], contracts[tokenRel.stakingRewards]];
    const USDCData = await getTokenData(contracts['USDC']);
    const GOVIData = await getTokenData(contracts['GOVI'], stakingProtocols.platform);

    const getAPYByTokenName = async (period) => {
      switch (tokenName) {
        case stakingConfig.tokens[selectedNetwork]["platform"]["govi-v1"]?.key:
        case stakingConfig.tokens[selectedNetwork]["platform"]["govi-v2"]?.key: {
          try {
            const tokensData = await (await Promise.all(await token.rewardsTokens.map(async t =>  await getTokenData(contracts[t]))));
            return await web3Api.getGOVIAPY(stakingRewards, tokensData, USDCData, GOVIData, {eventsUtils, library});
            } catch (error) {
              console.log(error)
              return []
            }
        }
        default: {
          const tokenData = await getTokenData(contracts[tokenRel.token], protocol === stakingProtocols.platform ? '' : protocol);
          return await web3Api.getAPYPerToken(platform, stakingRewards, USDCData, GOVIData, tokenData, token);
        }
      }
    }

    let apy = await getAPYByTokenName(DAY);

    cb(() => setStakedData((prev)=> ({
      ...prev,
      apy: apy.map((value) => value ? `${customFixed(value, 2)}%` : "N/A")
    })));
  }

  const getAPYSDK = async (cb) => {
    if (token.overrideApy !== undefined) {
      cb(() => setStakedData((prev)=> ({
        ...prev,
        apy: [token.overrideApy, token.overrideApy, token.overrideApy].map((value) => value >= 0 ? `${customFixed(value, 2)}%` : "N/A")
      })));
      return;
    }

    const stakingInstance = w3.stakings[tokenRel.stakingRewards];
    const dailyApr = await stakingInstance.getAPR(DAY);
    const apy = [aprToAPY(dailyApr, 365, 365 * 365), aprToAPY(dailyApr, 365, 365 * 7), aprToAPY(dailyApr, 365, 365)];
    
    cb(() => setStakedData((prev)=> ({
      ...prev,
      apy: apy.map((value) => value ? `${customFixed(value, 2)}%` : "N/A")
    })));
  }

  const getGoviValueStaked = async (cb) => {
    try {
        const GOVIData = await getTokenData(contracts['GOVI'], stakingProtocols.platform);
        const USDCData = await getTokenData(contracts['USDC']);
        const goviPrice = await getPrice(GOVIData, USDCData);
        const stakedAmount = await contracts[tokenRel.stakingRewards].methods.totalStaked().call();
        const goviValueStaked = customFixed(toFixed(toDisplayAmount(stakedAmount, GOVIData.decimals)) * goviPrice, USDCData.decimals);
        const tvl = {
          stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedAmount, token.decimals)), decimalsCountDisplay)),
          stakedAmountUSD: `${String(goviValueStaked) !== "0"  ? `$${commaFormatted(toFixed(customFixed(goviValueStaked, 2)))}` : "$0"}`
        }
        cb(() => setStakedData((prev)=> ({
          ...prev,
          tvl
        })));
    } catch(error) {
        console.log(error);
        return "N/A";
    }
  }

  const getStakedTVL = async (cb) => {
    try {
      if(isTokenGOVI) return getGoviValueStaked(cb);
      const [platform, stakingRewards] = [contracts[tokenRel.platform], contracts[tokenRel.stakingRewards]];
      const stakedAmount = await stakingRewards.methods.totalSupply().call();
      const stakedAmountToken = await fromLPTokens(platform, toBN(stakedAmount), token);
      const USDCData = await getTokenData(contracts['USDC']);
      const tokenData = await getTokenData(contracts[tokenRel.token], protocol);
      const totalBalanceWithAddendumUSDT = await convert(stakedAmountToken, tokenData, USDCData);
      const tvl = {
        stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedAmount, token.decimals)), decimalsCountDisplay)),
        stakedAmountUSD: toBN(stakedAmount).isZero() ? "0" : `$${commaFormatted(customFixed(toDisplayAmount(totalBalanceWithAddendumUSDT, USDCData.decimals), 2))}`
      };

      cb(() => setStakedData((prev)=> ({
        ...prev,
        tvl
      })));

    } catch(error) {
        console.log(error);
        return "N/A";
    }
  }

  const getStakedTVLSDK = async (cb) => {
    try {
      const stakingInstance = w3.stakings[tokenRel.stakingRewards];
      const stakedAmountUSD = await stakingInstance.getTVL();
      const stakedAmount = stakingInstance.totalStaked;

      const tvl = {
        stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedAmount, token.decimals)), decimalsCountDisplay)),
        stakedAmountUSD: toBN(stakedAmount).isZero() ? "0" : `$${commaFormatted(customFixed(stakedAmountUSD, 2))}`
      }

      cb(() => setStakedData((prev)=> ({
        ...prev,
        tvl
      })));
    } catch(error) {
      console.log(error);
      return "N/A";
    }
  }

  const getTVLLM = async (cb) => {
    try{
      const [stakingRewards, platformLPToken] = [contracts[tokenRel.stakingRewards], contracts[tokenRel.token]]
      const USDCData = await getTokenData(contracts['USDC']);
      const uniswapToken = pairsData[tokenRel.pairToken] || await getTokenData(contracts[tokenRel.pairToken], stakingProtocols.platform);
      const longTokenData = tokenRel.longToken ? await getTokenData(contracts[tokenRel.longToken], protocol) : undefined; 
      const uniswapLPToken = await getTokenData(platformLPToken, protocol);
      const poolSize = await stakingRewards.methods.totalSupply().call();

      const tvlUSD = await web3Api.uniswapLPTokenToUSD(poolSize, USDCData, uniswapLPToken, uniswapToken, longTokenData)

      const tvl = {
        stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(poolSize, token.decimals)), decimalsCountDisplay)),
        stakedAmountUSD: toBN(poolSize).isZero() ? "0" : `$${commaFormatted(customFixed(tvlUSD, 2))}`
      }
  
      cb(() => setStakedData((prev)=> ({
        ...prev,
        tvl
      })));
    }catch(error) {
      console.log("get tvl lm: ", error)
    }

  };

  const getAPYLM = async (cb) => {
    try{
      const [stakingRewards, platformLPToken] = [contracts[tokenRel.stakingRewards], contracts[tokenRel.token]]
      const USDCData = await getTokenData(contracts['USDC']);
      const GOVIData = await getTokenData(contracts['GOVI'], stakingProtocols.platform);
      const uniswapLPToken = await getTokenData(platformLPToken, protocol);
      const uniswapToken = pairsData[tokenRel.pairToken] || await getTokenData(contracts[tokenRel.pairToken], stakingProtocols.platform);
      const longTokenData = tokenRel.longToken ? await getTokenData(contracts[tokenRel.longToken], protocol) : undefined; 
      const apy = await web3Api.getUniswapAPY(stakingRewards, USDCData, GOVIData, uniswapLPToken, uniswapToken, longTokenData);
      // console.log(tokenName, protocol+" apy: ", apy);
      cb(() => setStakedData((prev)=> ({
        ...prev,
        apy: apy.map((value)=> value ? `${customFixed(value, 2)}%` : "N/A")
      })));
    }catch(error) {
      console.log("geyAPYLM: ", error)
      console.log(tokenName+" protocol: ", protocol)
    }
  };
      
  const getTokenBalance = async (cb) => {
    if(!account) return cb(()=> setStakedData((prev)=>({
      ...prev,
      balance: {
        tokenBalance: 0,
        usdBalance: "$0",
        formatted: 0
      }
    })))

    try {
      let balance = 0;
      const getUSDBalanceByProtocol = async() => {
        let tokenData;
        const USDCData = await getTokenData(contracts['USDC']);
        switch (protocol) {
          case stakingProtocols.platform: {
            tokenData = await getTokenData(contracts[isTokenGOVI ? 'GOVI' : tokenRel.platform], protocol);
            const tokenData2 = await getTokenData(contracts[isTokenGOVI ? 'GOVI' : tokenRel.token], protocol);
            balance = await tokenData.contract.methods.balanceOf(account).call();
            const amountToConvert = async () => isTokenGOVI ? toBN(balance) : await fromLPTokens(tokenData.contract, toBN(balance), token);
            const usdBalance = await convert(await amountToConvert(), tokenData2, USDCData);
            return `$${commaFormatted(customFixed(toFixed(toDisplayAmount(usdBalance, USDCData.decimals)), 2))}`
          }
          default: {
            tokenData = await getTokenData(contracts[tokenRel.token], protocol);
            balance = await tokenData.contract.methods.balanceOf(account).call();
            const uniswapToken = pairsData[tokenRel.pairToken] || await getTokenData(contracts[tokenRel.pairToken], stakingProtocols.platform);
            const longTokenData = tokenRel.longToken ? await getTokenData(contracts[tokenRel.longToken], protocol) : undefined; 
            const usdBalance = await web3Api.uniswapLPTokenToUSD(balance, USDCData, tokenData, uniswapToken, longTokenData);
            return `$${commaFormatted(customFixed(toFixed(toDisplayAmount(usdBalance)), 2))}`
          }
        }
      }


      const usdBalance = await getUSDBalanceByProtocol();
      
      cb(()=> setStakedData((prev)=>({
        ...prev,
        balance: {
          tokenBalance: balance,
          usdBalance,
          formatted: commaFormatted(customFixed(toFixed(toDisplayAmount(balance, token.decimals)), token.fixedDecimals))
        }
      })))
    } catch (error) {
      console.log(protocol + " " +tokenName+" error:" ,error);
      return "N/A";
    }
  }

  const getTokenBalanceSDK = async (cb) => {
    if(!account) return cb(()=> setStakedData((prev)=>({
      ...prev,
      balance: {
        tokenBalance: 0,
        usdBalance: "$0",
        formatted: 0
      }
    })))

    try {
      const goviToken = w3.tokens['GOVI'];
      const tokenBalance = await goviToken.balanceOf(account);
      const usdBalance = isNaN(tokenBalance)? 'N/A' : `$${commaFormatted(customFixed(toFixed(toDisplayAmount(goviToken.toUSD(tokenBalance))), 2))}`;
      cb(()=> setStakedData((prev)=>({
        ...prev,
        balance: {
          tokenBalance,
          usdBalance,
          formatted: commaFormatted(customFixed(toFixed(toDisplayAmount(tokenBalance, token.decimals)), 2))
        }
      })))
    } catch (error) {
      console.log(protocol + " " + tokenName + "error:", error);
      return "N/A";
    }
  }

  const fetchLiquidityMiningData = async (cb) => {
    getAPYLM(cb)
    getTVLLM(cb);
  }

  const fetchData = async (cb) => {
    if (stakingProtocols.platform === protocol && tokenName?.includes('govi')) {
      getTokenBalanceSDK(cb)
      getAPYSDK(cb);
      getStakedTVLSDK(cb);
      return;
    }

    getTokenBalance(cb)
    if(protocol !== stakingProtocols.platform) return fetchLiquidityMiningData(cb);
    getAPY(cb);
    getStakedTVL(cb);
  }

  useEffect(()=>{
    if(!contracts || !tokenRel || !web3Api || !web3Api.getAPYPerToken || !web3Api.getPoolSizeLiquidityMining || !selectedNetwork || !w3) return

    let canceled = false;
    fetchData((cb)=>{
      if(canceled) return
      cb();
    });

    return () => {
      canceled = true;
    }
    // eslint-disable-next-line
  }, [contracts, events, selectedNetwork, w3]);
    
  return useMemo(() => {
    if(!tokenRel) return [stakedData];

    return [stakedData]
      //eslint-disable-next-line
  }, [stakedData]);
}

export default useStakedData;