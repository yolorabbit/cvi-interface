import { getBalance, getCviValue } from "contracts/utils";
import { getTokenData } from "contracts/web3Api";
import { gas, maxUint256, toBN } from "utils";

export const MAX_CVI_VALUE = 20000;

export const getPositionValue = async (platform, account) => {
  try {
    return await platform.methods.calculatePositionBalance(account).call();
  } catch(error) {
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
    if (type === "eth" || type === "v2"){
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
    return { fee: toBN(buyingPremiumFee), percent: combinedPremiumFeePercentage, turbulence};
}

async function getOpenPositionFeePercent(platform, feesCalc, tokenAmount) {
    let openFeePrecent = toBN(await feesCalc.methods.openPositionFeePercent().call());
    let maxFeePercent = toBN(await platform.methods.MAX_FEE_PERCENTAGE().call());
    return maxFeePercent !== 0 ? tokenAmount.mul(openFeePrecent).div(maxFeePercent) : 0;
}

export async function getOpenPositionFee(contracts, token, {leverage = 1, tokenAmount}) {
    try {
        const tokenData = await getTokenData(contracts[token.rel.contractKey]);
        const cviValue = await getCviValue(contracts[token.rel.cviOracle]);
        let openFeeAmount = await getOpenPositionFeePercent(contracts[token.rel.platform], contracts[token.rel.feesCalc], tokenAmount);
        const { fee, percent, turbulence } = await getBuyingPremiumFee(contracts[token.rel.platform], tokenData, contracts[token.rel.feesCalc], contracts[token.rel.feesModel], tokenAmount, cviValue, leverage, token.type);
        return { openFee: openFeeAmount.add(fee).mul(toBN(leverage)), buyingPremiumFeePercent: percent, turbulence }
    } catch(error) {
        console.log(error);
        return "N/A";
    }   
}

export async function getClosePositionFee(contracts, token, {tokenAmount, account}) {
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

async function getCurrentFundingFee(contracts, token, {account}) {
  if (token.type === "v1") {
    return await getCurrentFundingFeeV1(contracts[token.rel.platform], account);
  }
  return await getCurrentFundingFeeV2(contracts[token.rel.platform], account);
}

async function getFundingFeePerTimePeriod(contracts, token, {tokenAmount, period = 86400}) {
  const cviValue = await getCviValue(contracts[token.rel.cviOracle]);
  let positionUnitsAmount = fromTokenAmountToUnits(tokenAmount, toBN(cviValue));
  let decimals = await contracts[token.rel.platform].methods.PRECISION_DECIMALS().call();
  let fee = toBN(await contracts[token.rel.feesCalc].methods.calculateSingleUnitFundingFee([{ period, cviValue }]).call());
  return fee.mul(toBN(positionUnitsAmount)).div(toBN(decimals));
}


const positionApi = {
    getOpenPositionFee,
    getCurrentFundingFee,
    getFundingFeePerTimePeriod,
    getClosePositionFee
}

export default positionApi;