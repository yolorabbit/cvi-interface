import { useContext, useEffect, useMemo, useState } from "react";
import { contractsContext } from "contracts/ContractContext";
import stakingConfig from 'config/stakingConfig';
import { useWeb3React } from "@web3-react/core";
import { commaFormatted, customFixed, toBN, toDisplayAmount } from "utils";
import web3Api, { getTokenData } from "contracts/web3Api";
import { convert, fromLPTokens } from "contracts/utils";
import { useEvents } from "../useEvents";

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
    status: null
}

const useStakedData = (chainName, protocol, tokenName) => {
  const contracts = useContext(contractsContext);
  const { account } = useWeb3React();
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
          return await token.rewardsTokens.map(async t => await contracts[tokenRel.stakingRewards].methods.profitOf(account, contracts[t]._address).call());
        default: 
          return [await contracts[tokenRel.stakingRewards].methods.earned(account).call()]
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
      
  useEffect(()=>{
    let canceled = false;
    const fetchData = async (cb) => {
      getStakedAmountAndPoolShare(cb);
      getClaimableRewards(cb);
      getDailyReward(cb);
      getAPY(cb);
    }

    if(!tokenRel) return
    fetchData((cb)=>{
      if(canceled) return
      cb()
    });

    return () => {
      canceled = true;
    }
    // eslint-disable-next-line
  }, []);
    
  return useMemo(() => {
    if(!tokenRel) return [stakedData];

    return [stakedData]
      //eslint-disable-next-line
  }, [stakedData]);
}

export default useStakedData;