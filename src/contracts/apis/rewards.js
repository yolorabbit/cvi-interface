import { fromTokenAmountToUnits, toBN } from '../../utils';
import { getOpenPositionFee } from './position';
import Web3 from 'web3';
import { getNow, getPositionRewardsContract } from 'contracts/utils';

var BN = Web3.utils.BN;


async function calculatePositionReward(contracts, token, {account, tokenAmount, leverage = 1, openTime = 0}) {
  
  const PositionRewardsHelper = await getPositionRewardsContract(token);
  if(!PositionRewardsHelper){
    openTime = await getNow();
  }
  let fees = await getOpenPositionFee(contracts, token, {tokenAmount, leverage});
  const { getCVILatestRoundData  } = contracts[token.rel.cviOracle].methods || {};
  const { cviValue } = getCVILatestRoundData ? await getCVILatestRoundData().call() : {};
  let positionUnits = fromTokenAmountToUnits(tokenAmount.sub(toBN(fees.openFee)), cviValue);
  let currentReward = 0;
  let reward = 0;

  try {
    let pos = await contracts[token.rel.platform].methods.positions(account).call();
    let unclaimed = await contracts[token.rel.rewards].methods.unclaimedPositionUnits(account).call();
    let min = BN.min(toBN(unclaimed), toBN(pos.positionUnitsAmount));
    try {
      currentReward = await contracts[token.rel.rewards].methods.calculatePositionReward(min, openTime).call();
    } catch(error) {
      console.log(error);
    }
    positionUnits = positionUnits.add(min);
   
    if(PositionRewardsHelper) {
      reward = await PositionRewardsHelper.methods.calculatePositionReward(positionUnits, openTime).call();
    } else {
      reward = await contracts[token.rel.rewards].methods.calculatePositionReward(positionUnits, openTime).call();
    }
  } catch (error) {
    console.log(error);
  }

  return toBN(reward).sub(toBN(currentReward));
}


const rewardsApi = {
  calculatePositionReward
}

export default rewardsApi;