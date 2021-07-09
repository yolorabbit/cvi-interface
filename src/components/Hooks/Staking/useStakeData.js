import { useContext, useEffect, useMemo, useState } from "react";
import { contractsContext } from "contracts/ContractContext";
import stakingConfig from 'config/stakingConfig';
import { useWeb3React } from "@web3-react/core";
import { commaFormatted, customFixed, toDisplayAmount } from "utils";
import web3Api, { getTokenData } from "contracts/web3Api";
import { convert } from "contracts/utils";

const initialState = {
    stakedTokenAmount: null,
    stakedAmount: null,
    stakedAmountUSD: null,
    lastStakedAmount: {
      class: null,
      value: null
    },
    poolSize: null,
    dailyReward: {
      amount: null,
      symbol: null
    },
    apy: null,
    claim: {
      amount: null,
      symbol: null
    },
    status: null
}

const useStakedData = (chainName, protocol, tokenName) => {
  const contracts = useContext(contractsContext);
  const { account } = useWeb3React();
  const [stakedData, setStakedData] = useState(initialState);

  const token = stakingConfig.tokens[chainName][protocol][tokenName];
  const tokenRel = token.rel;

  const decimalsCountDisplay = 8;

  const getStakedAmountAndPoolShare = async (cb) => {
    const data = await web3Api.getStakedAmountAndPoolShare(contracts[tokenRel.stakingRewards], account, token.decimals);
    const USDTData = await getTokenData(contracts.USDT);
    const tokenData = await getTokenData(contracts[tokenRel.token]);

    // TODO: Fix ETH conver price
    const stakedAmountUSD = await convert(data.stakedTokenAmount, tokenData, USDTData);

    cb(() => setStakedData((prev)=>({
      ...prev,
      ...data,
      stakedAmountUSD: commaFormatted(customFixed(toDisplayAmount(stakedAmountUSD, token.decimals), decimalsCountDisplay))
    })));
  }

  const getClaimableRewards = async (cb) => {
    const claimableRewards = await contracts[tokenRel.stakingRewards].methods.earned(account).call();
    const claim = {
        amount: commaFormatted(customFixed(toDisplayAmount(claimableRewards, token.decimals), decimalsCountDisplay)),
        symbol: "GOVI"
    }
    cb(() => setStakedData((prev)=> ({
      ...prev,
      claim
    })));
  }
  
  const getDailyReward = async (cb) => {
    const dailyReward = await web3Api.getDailyReward(contracts[tokenRel.stakingRewards], account, token.decimals);
    cb(() => setStakedData((prev)=> ({
      ...prev,
      dailyReward
    })));
  }

  const getAPY = async (cb) => {
      const [platform, stakingRewards, token] = [contracts[tokenRel.platform], contracts[tokenRel.stakingRewards], contracts[tokenRel.token]];
      const USDTData = await getTokenData(contracts.USDT);
      const GOVIData = await getTokenData(contracts.GOVI);
      const tokenData = await getTokenData(token);
      const apy = await web3Api.getAPYPerToken(platform, stakingRewards, USDTData, GOVIData, tokenData);
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
    // eslint-disable-next-line
  }, []);
    
  return useMemo(() => {
    if(!tokenRel) return [stakedData];

    return [stakedData]
      //eslint-disable-next-line
  }, [stakedData]);
}

export default useStakedData;

