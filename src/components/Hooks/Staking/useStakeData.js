import { useContext, useEffect, useMemo, useState } from "react";
import { contractsContext } from "contracts/ContractContext";
import stakingConfig from 'config/stakingConfig';
import { useWeb3React } from "@web3-react/core";
import { commaFormatted, customFixed, toBN, toDisplayAmount } from "utils";
import web3Api, { getTokenData } from "contracts/web3Api";
import { convert, fromLPTokens, getPrice } from "contracts/utils";
import { useEvents } from "../useEvents";
import stakingApi from "contracts/apis/staking";
import BigNumber from "bignumber.js";

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
  apy: null,
  claim: [{
    amount: null,
    symbol: null
  }],
  status: null,
  tvl: {
    stakedAmountLP: null,
    stakedAmountUSD: null
  }
}

const COTIData = { address: '0xDDB3422497E61e13543BeA06989C0789117555c5', symbol: 'COTI', decimals: 18 };
const RHEGIC2Data = { address: '0xad7ca17e23f13982796d27d1e6406366def6ee5f', symbol: 'RHEGIC2', decimals: 18 };

const useStakedData = (chainName, protocol, tokenName) => {
  const contracts = useContext(contractsContext);
  const { account } = useActiveWeb3React();
  const [stakedData, setStakedData] = useState(initialState);
  const eventsUtils = useEvents();
  const token = stakingConfig.tokens[chainName][protocol][tokenName];
  const tokenRel = token.rel;
  const decimalsCountDisplay = 8;

  const getStakedAmountAndPoolShare = async (cb) => {
    let tokenData;
    const getDataByTokenName = async () => {
      switch (tokenName) {
        case 'govi':{
          tokenData = await getTokenData(contracts.GOVI)
          return web3Api.getStakedAmountAndPoolShareGOVI(contracts[tokenRel.stakingRewards], account, token.decimals)
        }
        default: {
          tokenData = await getTokenData(contracts[tokenRel.token]);
          return web3Api.getStakedAmountAndPoolShare(contracts[tokenRel.stakingRewards], account, token.decimals)
        }
      }
    }
    const data = await getDataByTokenName();
    const USDTData = await getTokenData(contracts.USDT);
    const getAmount = async () => tokenName === "govi" ? data.stakedTokenAmount : await fromLPTokens(contracts[tokenRel.platform], toBN(data.stakedTokenAmount));

    const stakedAmountUSD = await convert(await getAmount(), tokenData, USDTData);
    cb(() => setStakedData((prev)=>({
      ...prev,
      ...data,
      stakedAmountUSD: commaFormatted(customFixed(toDisplayAmount(stakedAmountUSD.toString(), USDTData.decimals), decimalsCountDisplay))
    })));
  }

  const getClaimableRewards = async (cb) => {
    const getClaimableRewardsByTokenName = async () => {
      switch (tokenName) {
        case 'govi':
          return !!account ? await token.rewardsTokens.map(async t => await contracts[tokenRel.stakingRewards].methods.profitOf(account, contracts[t]._address).call()) : [0];
        default: 
          return !!account ? [await contracts[tokenRel.stakingRewards].methods.earned(account).call()] : [0];
      }
    }
    const claimableRewards = await (await Promise.allSettled(await getClaimableRewardsByTokenName()))
    .filter(({status}) => status === "fulfilled")
    .map(({value}, idx) => ({
        amount: commaFormatted(customFixed(toDisplayAmount(value, tokenRel.tokenDecimals[idx]), decimalsCountDisplay)),
        symbol: token.rewardsTokens[idx]
    }));

    cb(() => setStakedData((prev)=> ({
      ...prev,
      claim: claimableRewards
    })));
  }
  
  const getDailyReward = async (cb) => {
    const getDailyRewardsByTokenName = async () => {
      switch (tokenName) {
        case 'govi': {
          return await token.rewardsTokens.map(async (t,idx) => {
            const events = await eventsUtils.getTransferEvents(contracts[tokenRel.stakingRewards], contracts[t], 30);
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

    const getAPYByTokenName = async () => {
      switch (tokenName) {
        case 'govi': {
          const tokensData = await Promise.all(
            await token.rewardsTokens.map(async t => {
              const tokenData = await getTokenData(contracts[t])
              tokenData.events = await eventsUtils.getTransferEvents(stakingRewards, contracts[t], 30);
              return tokenData;
            })
          );
          return await web3Api.getGOVIAPY(stakingRewards, tokensData, USDTData, GOVIData);
        }
        default: {
          const tokenData = await getTokenData(contracts[tokenRel.token]);
          return await web3Api.getAPYPerToken(platform, stakingRewards, USDTData, GOVIData, tokenData);
        }
      }
    }

    const apy = await getAPYByTokenName();

    cb(() => setStakedData((prev)=> ({
      ...prev,
      apy: apy ? `${customFixed(apy, 2)}%` : "N/A"
    })));
  }

  const getGoviValueStaked = async (cb) => {
    try {
        const GOVIData = await getTokenData(contracts.GOVI);
        const USDTData = await getTokenData(contracts.USDT);
        const goviPrice = await getPrice(GOVIData, USDTData);
        const stakedAmount = await contracts[tokenRel.stakingRewards].methods.totalStaked().call();
        const goviValueStaked = customFixed(toDisplayAmount(stakedAmount, GOVIData.decimals) * goviPrice, USDTData.decimals);
        const tvl = {
          stakedAmountLP: commaFormatted(customFixed(toDisplayAmount(stakedAmount, token.decimals), decimalsCountDisplay)),
          stakedAmountUSD: `${String(goviValueStaked) !== "0"  ? `$${commaFormatted(customFixed(goviValueStaked, 2))}` : "$0"}`
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
        stakedAmountLP: commaFormatted(customFixed(toDisplayAmount(stakedAmount, token.decimals), decimalsCountDisplay)),
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

  const getStakedAmountAndPoolShareLM = async (cb) => {
    const [stakingRewards, platformLPToken] = [contracts[tokenRel.stakingRewards], contracts[tokenRel.token]]
    const USDTData = await getTokenData(contracts.USDT);
    const GOVIData = await getTokenData(contracts.GOVI);
    const uniswapToken =  tokenName === "coti-eth-lp" ? COTIData : tokenName === "govi-eth-lp" ? GOVIData : RHEGIC2Data;
    const uniswapLPToken = await getTokenData(platformLPToken);
    const poolSize = await stakingRewards.methods.totalSupply().call();
    // console.log("poolSize: ", poolSize);
    const tvlUSD = await web3Api.uniswapLPTokenToUSD(poolSize, USDTData, uniswapLPToken, uniswapToken)
    // console.log(tokenName, protocol+" tvlUSD: ", tvlUSD);
    
    const totalStaked = await stakingRewards.methods.balanceOf(account).call();
    // console.log("totalStaked: ", toDisplayAmount(totalStaked, token.decimals));

    const accountStakedUSD = await web3Api.uniswapLPTokenToUSD(totalStaked, USDTData, uniswapLPToken, uniswapToken)
    // console.log(tokenName, protocol+" accountStakedUSD: ", accountStakedUSD);
    const mySharePercentage = toBN(totalStaked).isZero() ? "0" : BigNumber(totalStaked).dividedBy(BigNumber(poolSize)).multipliedBy(BigNumber(100));
    
    getDailyRewardLM(mySharePercentage, cb);

    const data = {
      stakedTokenAmount: totalStaked,
      stakedAmount: commaFormatted(customFixed(toDisplayAmount(totalStaked, token.decimals), decimalsCountDisplay)),
      poolSize: toBN(poolSize).isZero() ? "0" : commaFormatted(customFixed(toDisplayAmount(poolSize, token.decimals), decimalsCountDisplay)),
      lastStakedAmount: {
        class: mySharePercentage < 0 ? 'low' : 'high',
        value: `(${customFixed(mySharePercentage, 2)}%)`
      },
      stakedAmountUSD: toBN(accountStakedUSD).isZero() ? "0" : `${commaFormatted(customFixed(toDisplayAmount(accountStakedUSD, USDTData.decimals), 2))}`
    };
    
    const tvl = {
      stakedAmountLP: commaFormatted(customFixed(toDisplayAmount(poolSize, token.decimals), decimalsCountDisplay)),
      stakedAmountUSD: toBN(poolSize).isZero() ? "0" : `$${commaFormatted(customFixed(tvlUSD, 2))}`
    }
    // console.log(tokenName+" data: ", data);
    // console.log(tokenName+" tvl: ", tvl);
    cb(() => setStakedData((prev)=> ({
      ...prev,
      ...data,
      tvl
    })));

  };
  const getAPYLM = async (cb) => {
    const [stakingRewards, platformLPToken] = [contracts[tokenRel.stakingRewards], contracts[tokenRel.token]]
    const USDTData = await getTokenData(contracts.USDT);
    const GOVIData = await getTokenData(contracts.GOVI);
    const uniswapLPToken = await getTokenData(platformLPToken);
    const uniswapToken =  tokenName === "coti-eth-lp" ? COTIData : tokenName === "govi-eth-lp" ? GOVIData : RHEGIC2Data;
    const apy = await web3Api.getUniswapAPY(stakingRewards, USDTData, GOVIData, uniswapLPToken, uniswapToken)
    // console.log(tokenName, protocol+" apy: ", apy);
    cb(() => setStakedData((prev)=> ({
      ...prev,
      apy: apy[0] ? `${customFixed(apy[0], 2)}%` : "N/A"
    })));
  };

  const getClaimableRewardsLM = async (cb) => {
    const rewards = await contracts[tokenRel.stakingRewards].methods.earned(account).call();
    // console.log(tokenName, protocol+" rewards: ", rewards );
    const claim = [{
      amount: commaFormatted(customFixed(toDisplayAmount(rewards, tokenRel.tokenDecimals[0]), decimalsCountDisplay)),
      symbol: token.rewardsTokens[0]
    }]
    cb(() => setStakedData((prev)=> ({
      ...prev,
      claim
    })));
  };
  
  const getDailyRewardLM = async (mySharePercentage, cb) => {
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
      
  useEffect(()=>{
    let canceled = false;
    
    const fetchLiquidityMiningData = async (cb) => {
      getStakedAmountAndPoolShareLM(cb);
      getAPYLM(cb)
      getClaimableRewardsLM(cb)
    }

    const fetchData = async (cb) => {
      if(protocol !== "platform") return fetchLiquidityMiningData(cb);
      getStakedAmountAndPoolShare(cb);
      getClaimableRewards(cb);
      getAPY(cb);
      getStakedTVL(cb);
      getDailyReward(cb);
    }

    if(!contracts || !tokenRel) return

    fetchData((cb)=>{
      if(canceled) return
      cb()
    });

    return () => {
      canceled = true;
    }
    // eslint-disable-next-line
  }, [contracts]);
    
  return useMemo(() => {
    if(!tokenRel) return [stakedData];

    return [stakedData]
      //eslint-disable-next-line
  }, [stakedData]);
}

export default useStakedData;