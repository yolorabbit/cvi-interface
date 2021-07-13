import { getBalance, getChainName, getCviValue } from "contracts/utils";
import { getTokenData } from "contracts/web3Api";
import { gas, maxUint256, toBN, toDisplayAmount } from "utils";
import * as TheGraph from 'graph/queries';
import { contractState } from "components/Hooks/useHistoryEvents";
import config from "config/config";
import { bottomBlockByNetwork, DEFAULT_STEPS } from "components/Hooks/useEvents";
import moment from "moment";
import { getLatestBlockTimestamp } from './../web3Api';

export const MAX_CVI_VALUE = 20000;

export const getPositionValue = async (platform, account) => {
  try {
    return await platform.methods.calculatePositionBalance(account).call();
  } catch (error) {
    return "N/A";
  }
}

export function fromUnitsToTokenAmount(units, index) {
  return units.mul(toBN(index)).div(toBN('20000'));
}

export function fromTokenAmountToUnits(tokenAmount, index) {
  return toBN(tokenAmount).mul(toBN(MAX_CVI_VALUE)).div(toBN(index));
}

export async function approve(contract, from, to, amount = maxUint256) {
  if (!contract) return;
  let allowance = await contract.methods.allowance(from, to).call();
  if (allowance.toString() !== "0") await contract.methods.approve(to, 0).send({ from, ...gas });
  const res = await contract.methods.approve(to, amount).send({ from, ...gas });
  allowance = await contract.methods.allowance(from, to).call();
  console.log(`approve ${res.status ? "success" : "failed"}: allowance ${allowance}`);
}

async function getCollateralRatio(platform, feesCalc, tokenData, openTokenAmount, cviValue, leverage, type) {
  let tokenContract = tokenData ? tokenData.contract : undefined;
  let balance = toBN(await getBalance(platform._address, tokenContract ? tokenContract._address : undefined));
  // if (type == "eth") balance = balance.sub(openTokenAmount);
  // console.log(`balance: ${balance}`);
  if (!balance.gt(toBN(0))) {
    return toBN(0);
  }

  let maxFeePercent = toBN(await platform.methods.MAX_FEE_PERCENTAGE().call());
  let openFeePrecent;
  if (type === "eth" || type === "v2") {
    const fees = await feesCalc.methods.openPositionFees().call();
    openFeePrecent = fees.openPositionFeePercentResult;
  } else {
    openFeePrecent = await feesCalc.methods.openPositionFeePercent().call();
  }
  // console.log(`openFeePrecent: ${openFeePrecent}`);
  let openPositionFee = openTokenAmount.mul(toBN(leverage)).mul(toBN(openFeePrecent)).div(maxFeePercent);
  // console.log(`openPositionFee: ${openPositionFee}`);
  let maxPositionUnitsAmount = openTokenAmount.sub(openPositionFee).mul(toBN(leverage)).mul(toBN(MAX_CVI_VALUE)).div(toBN(cviValue));
  // console.log(`maxPositionUnitsAmount: ${maxPositionUnitsAmount}`);
  let minPositionUnitsAmount = maxPositionUnitsAmount.mul(toBN(90)).div(toBN(100));
  // console.log(`minPositionUnitsAmount: ${minPositionUnitsAmount}`);

  let totalPositionUnitsAmount = toBN(await platform.methods.totalPositionUnitsAmount().call());
  // console.log(`totalPositionUnitsAmount: ${totalPositionUnitsAmount}`);

  let precisionDecimals = toBN(await platform.methods.PRECISION_DECIMALS().call());
  let collateralRatio = totalPositionUnitsAmount
    .add(minPositionUnitsAmount)
    .mul(precisionDecimals)
    .div(balance.add(openTokenAmount).sub(openPositionFee));
  return collateralRatio;
}

async function getBuyingPremiumFee(platform, tokenData, feesCalc, feesModel, tokenAmount, cviValue, leverage = 1, type) {
  let collateralRatio = await getCollateralRatio(platform, feesCalc, tokenData, tokenAmount, cviValue, leverage, type);
  // console.log(`collateralRatio: ${collateralRatio} (${fromBN(collateralRatio, 10) * 100}%)`);
  const turbulence = await feesModel.methods.calculateLatestTurbulenceIndicatorPercent().call();
  // console.log(`turbulence: ${turbulence}`);
  // const turbulencePercent = await feesCalc.methods.turbulenceIndicatorPercent().call();
  // console.log(`turbulencePercent: ${turbulencePercent}`);
  let buyingPremiumFee;
  let combinedPremiumFeePercentage = 0;
  // console.log(type);
  if (type === "v1") {
    buyingPremiumFee = await feesCalc.methods.calculateBuyingPremiumFeeWithTurbulence(tokenAmount, collateralRatio, turbulence).call();
  } else {
    ({ buyingPremiumFee, combinedPremiumFeePercentage } = await feesCalc.methods
      .calculateBuyingPremiumFeeWithTurbulence(tokenAmount, leverage, collateralRatio, turbulence)
      .call());
  }
  return { fee: toBN(buyingPremiumFee), percent: combinedPremiumFeePercentage, turbulence };
}

async function getOpenPositionFeePercent(platform, feesCalc, tokenAmount) {
  let openFeePrecent = toBN(await feesCalc.methods.openPositionFeePercent().call());
  let maxFeePercent = toBN(await platform.methods.MAX_FEE_PERCENTAGE().call());
  return maxFeePercent !== 0 ? tokenAmount.mul(openFeePrecent).div(maxFeePercent) : 0;
}

export async function getOpenPositionFee(contracts, token, { leverage = 1, tokenAmount }) {
  try {
    const tokenData = await getTokenData(contracts[token.rel.contractKey]);
    const cviValue = await getCviValue(contracts[token.rel.cviOracle]);
    let openFeeAmount = await getOpenPositionFeePercent(contracts[token.rel.platform], contracts[token.rel.feesCalc], tokenAmount);
    const { fee, percent, turbulence } = await getBuyingPremiumFee(contracts[token.rel.platform], tokenData, contracts[token.rel.feesCalc], contracts[token.rel.feesModel], tokenAmount, cviValue, leverage, token.type);
    return { openFee: openFeeAmount.add(fee).mul(toBN(leverage)), buyingPremiumFeePercent: percent, turbulence }
  } catch (error) {
    console.log(error);
    return "N/A";
  }
}

export async function getClosePositionFee(contracts, token, { tokenAmount, account }) {
  let pos = await contracts[token.rel.platform].methods.positions(account).call();
  if (toBN(pos.positionUnitsAmount).isZero()) {
    return toBN(0);
  }
  let posTimestamp = pos.creationTimestamp;
  let closeFeePrecent = toBN(await contracts[token.rel.feesCalc].methods.calculateClosePositionFeePercent(posTimestamp).call());
  let maxFeePercent = toBN(await contracts[token.rel.platform].methods.MAX_FEE_PERCENTAGE().call());
  return toBN(tokenAmount).mul(closeFeePrecent).div(maxFeePercent);
}

async function getCurrentFundingFeeV1(platform, account) {
  return await platform.methods.calculatePositionPendingFees(account).call();
}

async function getCurrentFundingFeeV2(platform, account) {
  let pos = await platform.methods.positions(account).call();
  return await platform.methods.calculatePositionPendingFees(account, pos.positionUnitsAmount).call();
}

async function getCurrentFundingFee(contracts, token, { account }) {
  if (token.type === "v1") {
    return await getCurrentFundingFeeV1(contracts[token.rel.platform], account);
  }
  return await getCurrentFundingFeeV2(contracts[token.rel.platform], account);
}

async function getFundingFeePerTimePeriod(contracts, token, { tokenAmount, period = 86400 }) {
  const cviValue = await getCviValue(contracts[token.rel.cviOracle]);
  let positionUnitsAmount = fromTokenAmountToUnits(tokenAmount, toBN(cviValue));
  let decimals = await contracts[token.rel.platform].methods.PRECISION_DECIMALS().call();
  let fee = toBN(await contracts[token.rel.feesCalc].methods.calculateSingleUnitFundingFee([{ period, cviValue }]).call());
  return fee.mul(toBN(positionUnitsAmount)).div(toBN(decimals));
}

async function getPositionsPNL(contracts, token, {currentPositionBalance, account, library, eventsUtils}) {
  try {
    let events = [];
    if(config.isMainnet) {
      events = await TheGraph.account_positions(account, contracts[token.rel.platform]._address, 0);
      events = Object.values(events).map((_events, idx) => _events.map((event) => ({ ...event, event: Object.keys(contractState.positions)[idx] }))).flat();
    } else {
      const chainName = await getChainName();
      let options = {};
      const latestBlockNumber = await (await library.eth.getBlock("latest")).number;
      const stepSize = latestBlockNumber - bottomBlockByNetwork[chainName];
      options = { stepSize: (parseInt(stepSize / DEFAULT_STEPS) + 1000), steps: DEFAULT_STEPS }
      const filters = { OpenPosition: [{ account }], ClosePosition: [{ account }], LiquidatePosition: [{ positionAddress: account }] };
      const eventsData = [{ contract: contracts[token.rel.platform], events: filters }];
      events = await eventsUtils.getEventsFast(eventsData, options);
    }

    events.sort((a, b) => toBN(a.blockNumber).cmp(toBN(b.blockNumber)));

    let openSum = toBN(0);
    let closeSum = toBN(0);
    events.forEach((event) => {
      switch (event.event) {
        case "openPositions":
          openSum = openSum.add(toBN(event.tokenAmount.toString()));
          break;
        case "closePositions":
          closeSum = closeSum.add(toBN(event.tokenAmount.toString()));
          if (toBN(event.positionUnitsAmount).isZero()) {
            openSum = toBN(0);
            closeSum = toBN(0);
          }
          break;
        case "liquidatePositions": // reset all sums.
          openSum = toBN(0);
          closeSum = toBN(0);
          break;
        default:
          break;
      }
    });

    let totalSum = openSum.sub(closeSum);
    let pnl = toBN(currentPositionBalance).sub(totalSum);
    let pnlPercent = 0;
    try {
      pnlPercent = !openSum.isZero() ? toDisplayAmount(toBN(pnl.toString(), 4).div(openSum), 2) : 0;
    } catch (error) {
      console.log(error);
    }
    
    return { amount: pnl.toString(), percent: pnlPercent };
  } catch(error) {
    console.log(error);
    return "N/A";
  }
 
}


async function getEstimatedLiquidationV2 (platform, feesCalc, liquidationContract, index, account) {
  const pos = await getPositionValue(platform, account)
  let decimals = await platform.methods.PRECISION_DECIMALS().call();
  let minThreshold = 50; //await liquidationContract.methods.liquidationMinThreshold().call()
  let maxPercentage = await liquidationContract.methods.LIQUIDATION_MAX_FEE_PERCENTAGE().call();
  let liquidationThreshold = toBN(pos.positionUnitsAmount).mul(toBN(minThreshold)).div(toBN(maxPercentage));
  let fee = toBN(await feesCalc.methods.calculateSingleUnitFundingFee([{ period: 86400, cviValue: index }]).call());
  let feePerDay = fee.mul(toBN(pos.positionUnitsAmount)).div(toBN(decimals));
  let liquidation = toBN(pos.currentPositionBalance).sub(liquidationThreshold).mul(toBN(100)).div(feePerDay);
  return parseFloat(liquidation.toString()) / 100;
}

async function getEstimatedLiquidationV1(platform, feeCalc, index, tokenAmount, account) {
  let {positionUnitsAmount, currentPositionBalance} = await platform.methods.calculatePositionBalance(account).call();
  currentPositionBalance = toBN(currentPositionBalance)
  if(tokenAmount) {
    currentPositionBalance = currentPositionBalance.add(fromTokenAmountToUnits(toBN(tokenAmount), index));
  }
  let decimals = await platform.methods.PRECISION_DECIMALS().call();
  let fee = toBN(await feeCalc.methods.calculateSingleUnitFundingFee([{ period: 86400, cviValue: index }]).call());
  let feePerDay = fee.mul(toBN(positionUnitsAmount)).div(toBN(decimals));
  let liquidation = toBN(currentPositionBalance).mul(toBN(100)).div(feePerDay);
  return parseFloat(liquidation.toString()) / 100;
}

async function getEstimatedLiquidation(contracts, token, { tokenAmount, account, library }) {
  try {
    const { getCVILatestRoundData } = contracts[token.rel.cviOracle].methods;
    const { cviValue } = await getCVILatestRoundData().call();
    let _estimatedLiquidation;
    if(token.type === "eth" || token.type === "v1") {
      _estimatedLiquidation = await getEstimatedLiquidationV1(contracts[token.rel.platform], contracts[token.rel.feesCalc], cviValue, tokenAmount ?? undefined, account);
    } else if(token.type === 'v2') {
      _estimatedLiquidation = await getEstimatedLiquidationV2(contracts[token.rel.platform], contracts[token.rel.feesCalc], contracts[token.rel.liquidation], cviValue, account);
    }

    const latestBlockTimestamp = await getLatestBlockTimestamp(library.eth.getBlock);
    return  moment.utc(latestBlockTimestamp * 1000).add(_estimatedLiquidation, 'days').format('DD/MM/YYYY');
  } catch(error) {
    console.log(error);
    return "N/A";
  }
}

const positionApi = {
  getOpenPositionFee,
  getCurrentFundingFee,
  getFundingFeePerTimePeriod,
  getClosePositionFee,
  getPositionsPNL,
  getEstimatedLiquidation
}

export default positionApi;