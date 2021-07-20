import { commaFormatted, customFixed, fromTokenAmountToUnits, toBN, toDisplayAmount, toFixed } from '../../utils';
import { getOpenPositionFee } from './position';
import Web3 from 'web3';
import { getPositionRewardsContract, getNow } from 'contracts/utils';
import moment from 'moment';
import { DAY } from '../../components/Hooks/useEvents';

var BN = Web3.utils.BN;

async function getClaimablePositionUnits(platform, rewards, account) {
  let { positionUnitsAmount, creationTimestamp } = await platform.methods.positions(account).call();
  const unclaimedPositionUnits = await rewards.methods.unclaimedPositionUnits(account).call();
  // positionUnitsAmount = positionUnitsAmount < unclaimedPositionUnits ? positionUnitsAmount : unclaimedPositionUnits;
  positionUnitsAmount = Math.min(positionUnitsAmount, unclaimedPositionUnits);
  // console.log(`getClaimablePositionUnits ${positionUnitsAmount} -- ${creationTimestamp}`);
  return { positionUnitsAmount, creationTimestamp };
}

export async function getClaimableReward(contracts, token, { account }) {
  const PositionRewardsHelper = await getPositionRewardsContract(token);
  const { positionUnitsAmount, creationTimestamp } = await getClaimablePositionUnits(contracts[token.rel.platform], contracts[token.rel.positionRewards], account);
  const units = toBN(toFixed(positionUnitsAmount.toString()));

  const currentClaimableRewards = units.gt(toBN(0)) ? 
  (PositionRewardsHelper ? 
      await PositionRewardsHelper.methods.calculatePositionReward(units.toString(), creationTimestamp).call() 
      : await contracts[token.rel.positionRewards].methods.calculatePositionReward(units.toString(), creationTimestamp).call()) 
      : 0;

  const maxClaimableRewards = units.gt(toBN(0)) ? 
  (PositionRewardsHelper ? 
      await PositionRewardsHelper.methods.calculatePositionReward(units.toString(), 0).call() 
      : await contracts[token.rel.positionRewards].methods.calculatePositionReward(units.toString(), 0).call()) 
      : 0;

  return [currentClaimableRewards, maxClaimableRewards]

}


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
  let maxCurrentReward = 0;
  let rewardHelper = 0;
  let maxHelperReward = 0;

  try {
    let pos = await contracts[token.rel.platform].methods.positions(account).call();
    let unclaimed = await contracts[token.rel.positionRewards].methods.unclaimedPositionUnits(account).call();
    let min = BN.min(toBN(unclaimed), toBN(pos.positionUnitsAmount));
   
    try {
      currentReward = await contracts[token.rel.positionRewards].methods.calculatePositionReward(min, openTime).call();
      maxCurrentReward = await contracts[token.rel.positionRewards].methods.calculatePositionReward(min, 0).call();
    } catch(error) {
      console.log(error);
    }
    positionUnits = positionUnits.add(min);
   
    if(PositionRewardsHelper) {
      rewardHelper = await PositionRewardsHelper.methods.calculatePositionReward(positionUnits, openTime).call();
      maxHelperReward = await PositionRewardsHelper.methods.calculatePositionReward(positionUnits, 0).call();
    } else {
      rewardHelper = await contracts[token.rel.positionRewards].methods.calculatePositionReward(positionUnits, openTime).call();
      maxHelperReward = await contracts[token.rel.positionRewards].methods.calculatePositionReward(positionUnits, 0).call();
    }
  } catch (error) {
    console.log(error);
  }

  return [toBN(rewardHelper).sub(toBN(currentReward)), toBN(maxHelperReward).sub(toBN(maxCurrentReward))];
}

async function getOpenPositionDays(events, getBlock) {
  let days = new Set();
  for (let i = 0; i < events.length; i++) {
    let block = await getBlock(events[i].blockNumber);
    let openTime = toBN(block.timestamp);
    let day = parseInt(openTime / 86400);
    days.add(day);
  }
  return days;
}

async function getClaimableRewardsExpand(contracts, token, { account, library, eventsUtils }) {
  let events = await eventsUtils.getEventsFast([{contract: contracts[token.rel.platform], events: { OpenPosition: [{ account }] } }], {});
  if(!events.length) return {0: toBN("0")};
  let days = await getOpenPositionDays(events, library.eth.getBlock);
  days.delete(parseInt(await eventsUtils.getLatestBlockTimestamp() / 86400)); // remove today from the list (if exists)
  // days.delete(18633); // remove nextday from the list (if ganace moved day)
  let claimableRewards = {};
  for (const day of days) {
      let userRewardPart = toBN(await contracts[token.rel.rewards].methods.dailyPerAddressReward(account, toBN(day)).call());
      if (!userRewardPart.isZero()) {
          let dailyRewards = toBN(await contracts[token.rel.rewards].methods.dailyRewards(toBN(day)).call());
          let totalRewardsPerDay = toBN(await contracts[token.rel.rewards].methods.totalRewardsPerDay(toBN(day)).call());
          let rewardAmount = userRewardPart.mul(dailyRewards).div(totalRewardsPerDay);
          claimableRewards[day] = rewardAmount;
      }
  }
  return claimableRewards;
}

async function getClaimableRewardsSum(contracts, token, { account, library, eventsUtils }) {
  let rewardsSum = toBN(0);
  let claimableRewards = await getClaimableRewardsExpand(contracts, token, { account, library, eventsUtils });
  for (const day in claimableRewards) {
    rewardsSum = rewardsSum.add(claimableRewards[day]);
  }
  return rewardsSum;
}

const getClaimableRewards = async (contracts, token, { account, library, eventsUtils }) => { // old position rewards
  if(token.type === 'eth') return [0, toBN(0), token.decimals];
  try {
      if(token.type === "v2" || token.type === "usdc") return [0, toBN(0), token.decimals];
      const res = await getClaimableRewardsSum(contracts, token, { account, library, eventsUtils });
      return [commaFormatted(customFixed(toDisplayAmount(res, token.lpTokensDecimals), 8)), res, token.lpTokensDecimals];
  } catch (error) {
      console.log(error);
      // no rewrads;
      return [0, toBN(0), token.lpTokensDecimals]
  }
}

async function getMaxDailyReward(rewards) {
  return await rewards.methods.maxDailyReward().call();
}

async function canClaim (contracts, token, { account, eventsUtils }) {
  try {
      const pos = await contracts[token.rel.platform].methods.positions(account).call();
      if (pos.positionUnitsAmount === 0) return { result: false, reason: "No opened position" };
    
      const timestamp = await eventsUtils.getNow();
      // console.log(`timestamp ${timestamp}`);
      const maxClaimPeriod = await contracts[token.rel.positionRewards].methods.maxClaimPeriod().call();
      // console.log(`maxClaimPeriod ${maxClaimPeriod}`);
      // console.log(`pos.creationTimestamp ${pos.creationTimestamp}`);
      if (timestamp > parseInt(pos.creationTimestamp) + parseInt(maxClaimPeriod)) return { result: false, reason: "Claim too late" };
    
      const today = Math.floor(timestamp / DAY);
      // const minClaimPeriod = await rewards.methods.minClaimPeriod().call();
      // if (timestamp <= parseInt(pos.creationTimestamp) + parseInt(minClaimPeriod)) return { result: false, reason: "Claim too early" };
      const positionDay = Math.floor(pos.creationTimestamp / DAY);
      if (today <= positionDay) return { result: false, reason: "Claim too early" };
      const [rewardAmount] = await getClaimableReward(contracts, token, { account });
      const lastClaimedDay = await contracts[token.rel.positionRewards].methods.lastClaimedDay().call();
      const maxDailyReward = await getMaxDailyReward(contracts[token.rel.positionRewards]);
      let todayClaimedRewards = today <= lastClaimedDay ? await contracts[token.rel.positionRewards].methods.todayClaimedRewards().call() : 0;
      todayClaimedRewards = toBN(todayClaimedRewards).add(toBN(rewardAmount));
      if (todayClaimedRewards.gt(toBN(maxDailyReward))) return { result: false, reason: "Not enough daily reward left for today" };
      return { result: true };
  } catch(error) {
      console.log(error);
  }
}

async function getTodayClaimedReward(rewards, eventsUtils) {
  const today = await eventsUtils.getLatestBlockTimestamp() / DAY;
  const lastClaimedDay = await rewards.methods.lastClaimedDay().call();
  return parseInt(today) <= lastClaimedDay ? await rewards.methods.todayClaimedRewards().call() : 0;
}

const getClaimData = async (contracts, token, { account, library, eventsUtils}) => {
  try {
      const { creationTimestamp } = await contracts[token.rel.platform].methods.positions(account).call();
      const claimableReward = await getClaimableRewards(contracts, token, { account, library, eventsUtils });
      const lastEndDate = moment.utc(creationTimestamp * 1000).add("30", "days");
      const lastEndOfDay = moment.utc(creationTimestamp * 1000).endOf('day').add('2', 'seconds');

      const _canClaim = await canClaim(contracts, token, { account, eventsUtils });
      let [claimableRewards, maxClaimableRewards] = await getClaimableReward(contracts, token, { account });;

      const maxDailyReward = await getMaxDailyReward(contracts[token.rel.positionRewards]);
      const todayClaimedReward = await getTodayClaimedReward(contracts[token.rel.positionRewards], eventsUtils);
      const reducedClaimableToday = toBN(maxDailyReward).sub(toBN(todayClaimedReward));
      const totalGoviToClaim = claimableReward[1].add(toBN(claimableRewards));
      const isClaimableAmount = reducedClaimableToday.cmp(toBN(claimableRewards)) === 1 ? claimableRewards : reducedClaimableToday;
      const claimAmountIsAvailable = reducedClaimableToday.cmp(toBN(totalGoviToClaim)) !== -1;

      return [{
          claimableRewards: customFixed(toDisplayAmount(isClaimableAmount.toString(), token.lpTokensDecimals), 8),
          maxClaimableRewards: customFixed(toDisplayAmount(maxClaimableRewards.toString(), token.lpTokensDecimals), 8),
          oldAmount: claimableReward[0] ?? "0",
          totalAmount: commaFormatted(customFixed(toDisplayAmount(reducedClaimableToday, token.lpTokensDecimals))),
          amount: customFixed(toDisplayAmount(totalGoviToClaim.toString(), token.lpTokensDecimals), 8),
          symbol: "GOVI",
          lastEndDate: lastEndDate, 
          isClaimAvailable: _canClaim?.result || claimableReward[0].toString() !== "0",
          lastEndOfDay: lastEndOfDay,
          canClaim: _canClaim?.result,
          claimAmountIsAvailable: _canClaim?.result && claimAmountIsAvailable
      }]

  } catch (error) {
      console.log(error);
      return "N/A";
  }
}

const rewardsApi = {
  getClaimableReward,
  calculatePositionReward,
  getClaimData
}

export default rewardsApi;