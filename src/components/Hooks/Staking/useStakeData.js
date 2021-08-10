import { useContext, useEffect, useMemo, useState } from "react";
import { contractsContext } from "contracts/ContractContext";
import stakingConfig from 'config/stakingConfig';
import { commaFormatted, customFixed, toBN, toDisplayAmount, toFixed } from "utils";
import web3Api, { getTokenData } from "contracts/web3Api";
import { convert, fromLPTokens, getPrice } from "contracts/utils";
import { DAY, useEvents } from "../useEvents";
import BigNumber from "bignumber.js";
import { useActiveWeb3React } from "../wallet";
import { useSelector } from "react-redux";

const initialState = {
  stakedTokenAmount: null,
  stakedAmount: null,
  stakedAmountUSD: null,
  lastStakedAmount: {
    class: null,
    value: null
  },
  poolSize: null,
  dailyReward: [{
    amount: null,
    symbol: null
  }],
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

const COTIData = { address: '0xDDB3422497E61e13543BeA06989C0789117555c5', symbol: 'COTI', decimals: 18 };
const RHEGIC2Data = { address: '0xAd7Ca17e23f13982796D27d1E6406366Def6eE5f', symbol: 'RHEGIC2', decimals: 18 };

const useStakedData = (chainName, protocol, tokenName, isStaked) => {
  const contracts = useContext(contractsContext);
  const { account } = useActiveWeb3React();
  const [stakedData, setStakedData] = useState(initialState);
  const eventsUtils = useEvents();
  const token = stakingConfig.tokens[chainName][protocol][tokenName];
  const tokenRel = token.rel;
  const decimalsCountDisplay = 8;
  const events = useSelector(({events})=> events);
  
  const getDailyReward = async (cb) => {
    const getDailyRewardsByTokenName = async () => {
      switch (tokenName) {
        case 'govi': {
          return await token.rewardsTokens.map(async (t,idx) => {
            const events = await eventsUtils.getTransferEvents(contracts[tokenRel.stakingRewards], contracts[t], 30, t);
            const now = await eventsUtils.getNow();
            return await web3Api.getDailyRewardPerToken(contracts[tokenRel.stakingRewards], account, events, now, t.replace("W",""), tokenRel.tokenDecimals[idx]);
          })
        }
        default: 
          return [await web3Api.getDailyReward(contracts[tokenRel.stakingRewards], account, token.decimals)]
      }
    }
    const dailyReward = await (await Promise.allSettled(await getDailyRewardsByTokenName()))
    .filter(({status}) => status === "fulfilled")
    .map(({value}) => value);

    cb(() => setStakedData((prev)=> ({
      ...prev,
      dailyReward
    })));
  }

  const getAPY = async (cb) => {
    const [platform, stakingRewards] = [contracts[tokenRel.platform], contracts[tokenRel.stakingRewards]];
    const USDTData = await getTokenData(contracts.USDT);
    const GOVIData = await getTokenData(contracts.GOVI);

    const getAPYByTokenName = async (period) => {
      switch (tokenName) {
        case 'govi': {
          try {
            const periodInDays = period/DAY;
            const tokensData = await (await Promise.all(await token.rewardsTokens.map(async t =>  await getTokenData(contracts[t]))));
            return await web3Api.getGOVIAPY(stakingRewards, tokensData, USDTData, GOVIData, periodInDays);
            } catch (error) {
              console.log(error)
              return []
            }
        }
        default: {
          const tokenData = await getTokenData(contracts[tokenRel.token]);
          return await web3Api.getAPYPerToken(platform, stakingRewards, USDTData, GOVIData, tokenData, period);
        }
      }
    }

    const periodsArray = isStaked ? [365*DAY] : [DAY]
    const apyByPeriods = periodsArray.map(async period => await getAPYByTokenName(period));
    console.log(apyByPeriods);
    let apy = await(await Promise.allSettled(apyByPeriods))
    .filter(({status}) =>  status === "fulfilled")
    .map(({value}) => value);
    console.log(apy);

    apy = apy?.[0]?.length > 0 ? [...apy[0].reverse()] : apy;

    console.log(apy);

    cb(() => setStakedData((prev)=> ({
      ...prev,
      apy: apy.map((value)=>value ? `${customFixed(value, 2)}%` : "N/A")
    })));
  }

  const getGoviValueStaked = async (cb) => {
    try {
        const GOVIData = await getTokenData(contracts.GOVI);
        const USDTData = await getTokenData(contracts.USDT);
        const goviPrice = await getPrice(GOVIData, USDTData);
        const stakedAmount = await contracts[tokenRel.stakingRewards].methods.totalStaked().call();
        const goviValueStaked = customFixed(toFixed(toDisplayAmount(stakedAmount, GOVIData.decimals)) * goviPrice, USDTData.decimals);
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
      if(tokenName === "govi") return getGoviValueStaked(cb);
      const [platform, stakingRewards] = [contracts[tokenRel.platform], contracts[tokenRel.stakingRewards]];
      const stakedAmount = await stakingRewards.methods.totalSupply().call();
      const stakedAmountToken = await fromLPTokens(platform, toBN(stakedAmount));
      const USDTData = await getTokenData(contracts.USDT);
      const tokenData = await getTokenData(contracts[tokenRel.token]);
      const totalBalanceWithAddendumUSDT = await convert(stakedAmountToken, tokenData, USDTData);
      const tvl = {
        stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(stakedAmount, token.decimals), decimalsCountDisplay))),
        stakedAmountUSD: toBN(stakedAmount).isZero() ? "0" : `$${commaFormatted(customFixed(toDisplayAmount(totalBalanceWithAddendumUSDT, USDTData.decimals), 2))}`
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

  const getTVLLM = async (cb) => {
    try{
      const [stakingRewards, platformLPToken] = [contracts[tokenRel.stakingRewards], contracts[tokenRel.token]]
      const USDTData = await getTokenData(contracts.USDT);
      const GOVIData = await getTokenData(contracts.GOVI);
      const uniswapToken =  tokenName === "coti-eth-lp" ? COTIData : tokenName === "govi-eth-lp" ? GOVIData : RHEGIC2Data;
      const uniswapLPToken = await getTokenData(platformLPToken);
      const poolSize = await stakingRewards.methods.totalSupply().call();
      // console.log("poolSize: ", poolSize);
      const tvlUSD = await web3Api.uniswapLPTokenToUSD(poolSize, USDTData, uniswapLPToken, uniswapToken)
      // console.log(tokenName, protocol+" tvlUSD: ", tvlUSD);
      const tvl = {
        stakedAmountLP: commaFormatted(customFixed(toFixed(toDisplayAmount(poolSize, token.decimals), decimalsCountDisplay))),
        stakedAmountUSD: toBN(poolSize).isZero() ? "0" : `$${commaFormatted(customFixed(tvlUSD, 2))}`
      }
      // console.log(tokenName+" data: ", data);
      // console.log(tokenName+" tvl: ", tvl);
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
      const USDTData = await getTokenData(contracts.USDT);
      const GOVIData = await getTokenData(contracts.GOVI);
      const uniswapLPToken = await getTokenData(platformLPToken);
      const uniswapToken =  tokenName === "coti-eth-lp" ? COTIData : tokenName === "govi-eth-lp" ? GOVIData : RHEGIC2Data;
      const apy = await web3Api.getUniswapAPY(stakingRewards, USDTData, GOVIData, uniswapLPToken, uniswapToken);
      // console.log(tokenName, protocol+" apy: ", apy);
      cb(() => setStakedData((prev)=> ({
        ...prev,
        apy: apy.map((value)=>value ? `${customFixed(value, 2)}%` : "N/A")
      })));
    }catch(error) {
      console.log("geyAPYLM: ", error)
      console.log(tokenName+" protocol: ", protocol)
    }
  };

  const getDailyRewardLM = async (cb) => {
    const poolSize = await contracts[tokenRel.stakingRewards].methods.totalSupply().call();
    const totalStaked = !!account ? await contracts[tokenRel.stakingRewards].methods.balanceOf(account).call() : 0;
    
    const mySharePercentage = toBN(totalStaked).isZero() ? "0" : BigNumber(totalStaked).dividedBy(BigNumber(poolSize)).multipliedBy(BigNumber(100));

    const rate = await contracts[tokenRel.stakingRewards].methods.rewardRate().call();

    const dailyReward = [{
      amount: commaFormatted(customFixed(toDisplayAmount(rate, 18) * 86400 * mySharePercentage / 100, 2)),
      symbol: token.rewardsTokens[0]
    }];
    
    cb(() => setStakedData((prev)=> ({
      ...prev,
      dailyReward
    })));
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
        const USDTData = await getTokenData(contracts.USDT);
        switch (protocol) {
          case "platform": {
            tokenData = await getTokenData(contracts[tokenName === "govi" ? "GOVI" : tokenRel.platform]);
            const tokenData2 = await getTokenData(contracts[tokenName === "govi" ? "GOVI" : tokenRel.token]);
            balance = await tokenData.contract.methods.balanceOf(account).call();
            const amountToConvert = async () => tokenName === "govi" ? toBN(balance) : await fromLPTokens(tokenData.contract, toBN(balance));
            const usdBalance = await convert(await amountToConvert(), tokenData2, USDTData);
            return "$"+commaFormatted(customFixed(toFixed(toDisplayAmount(usdBalance, USDTData.decimals)), 2))
          }
          default: {
            tokenData = await getTokenData(contracts[tokenRel.token]);
            balance = await tokenData.contract.methods.balanceOf(account).call();
            const GOVIData = await getTokenData(contracts.GOVI);
            const uniswapToken =  tokenName === "coti-eth-lp" ? COTIData : tokenName === "govi-eth-lp" ? GOVIData : RHEGIC2Data;            
            const usdBalance = await web3Api.uniswapLPTokenToUSD(balance, USDTData, tokenData, uniswapToken)
            return "$"+commaFormatted(customFixed(toFixed(toDisplayAmount(usdBalance)), 2))
          }
        }
      }


      const usdBalance = await getUSDBalanceByProtocol();
      
      cb(()=> setStakedData((prev)=>({
        ...prev,
        balance: {
          tokenBalance: balance,
          usdBalance,
          formatted: commaFormatted(customFixed(toFixed(toDisplayAmount(balance, token.decimals)), 2))
        }
      })))
    } catch (error) {
      console.log(protocol + " " +tokenName+" error:" ,error);
    }
  }

  const fetchLiquidityMiningData = async (cb) => {
    getAPYLM(cb)
    isStaked && getDailyRewardLM(cb);
    getTVLLM(cb);
  }

  const fetchData = async (cb) => {
    getTokenBalance(cb)
    if(protocol !== "platform") return fetchLiquidityMiningData(cb);
    getAPY(cb);
    getStakedTVL(cb);
    isStaked && getDailyReward(cb);
  }

  useEffect(()=>{
    if(!contracts || !tokenRel) return

    let canceled = false;
    fetchData((cb)=>{
      if(canceled) return
      cb()
    });

    return () => {
      canceled = true;
    }
    // eslint-disable-next-line
  }, [contracts, events]);
    
  return useMemo(() => {
    if(!tokenRel) return [stakedData];

    return [stakedData]
      //eslint-disable-next-line
  }, [stakedData]);
}

export default useStakedData;