import { fromTokenAmountToUnits, toBN } from '../../utils';
import { getOpenPositionFee } from './position';
import Web3 from 'web3';

var BN = Web3.utils.BN;

async function calculatePositionReward(contracts, token, {account, tokenAmount, leverage = 1, openTime = 0}) {
  // const PositionRewardsHelper = getPositionRewardsContract("PositionRewardsHelper", isEth);
  let fees = await getOpenPositionFee(contracts, token, {tokenAmount, leverage});
  const { getCVILatestRoundData  } = contracts[token.rel.cviOracle].methods || {};
  const { cviValue } = getCVILatestRoundData ? await getCVILatestRoundData().call() : {};
  let positionUnits = fromTokenAmountToUnits(tokenAmount.sub(toBN(fees.openFee)), cviValue);
  let currentReward = 0;

  try {
    let pos = await contracts[token.rel.platform].methods.positions(account).call();
    console.log(pos);
    let unclaimed = await contracts[token.rel.rewards].methods.unclaimedPositionUnits(account).call();
    console.log(unclaimed);
    let min = BN.min(toBN(unclaimed), toBN(pos.positionUnitsAmount));
    console.log(min);
    currentReward = await contracts[token.rel.rewards].methods.calculatePositionReward(min, openTime).call();
    console.log(currentReward);
    positionUnits = positionUnits.add(min);
  } catch (error) {
    console.log(error);
  }
  const reward = await contracts[token.rel.rewards].methods.calculatePositionReward(positionUnits, openTime).call();
  return toBN(reward).sub(toBN(currentReward));
}


const rewardsApi = {
  calculatePositionReward
}

export default rewardsApi;