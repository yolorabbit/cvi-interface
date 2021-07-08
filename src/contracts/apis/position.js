import { getBalance } from "contracts/utils";
import { getTokenData } from "contracts/web3Api";
import { getPlatformType, toBN } from "utils";

const MAX_CVI_VALUE = 20000;
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

async function getBuyingPremiumFee(platform, tokenData, feesCalc, feesModel, tokenAmount, cviValue, leverage = 1, tokenName) {
    const type = await getPlatformType(tokenName);

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
    return { fee: toBN(buyingPremiumFee), percent: combinedPremiumFeePercentage };
}

async function getOpenPositionFeePercent(platform, feesCalc, tokenAmount) {
    let openFeePrecent = toBN(await feesCalc.methods.openPositionFeePercent().call());
    let maxFeePercent = toBN(await platform.methods.MAX_FEE_PERCENTAGE().call());
    return maxFeePercent !== 0 ? tokenAmount.mul(openFeePrecent).div(maxFeePercent) : 0;
}

async function getOpenPositionFee(contracts, token, {leverage = 1, tokenAmount}) {
    try {
        const tokenData = await getTokenData(contracts[token.rel.contractKey]);
        const { getCVILatestRoundData  } = contracts[token.rel.cviOracle].methods || {};
        const { cviValue } = getCVILatestRoundData ? await getCVILatestRoundData().call() : {};
        let openFeeAmount = await getOpenPositionFeePercent(contracts[token.rel.platform], contracts[token.rel.feesCalc], tokenAmount);
        const { fee, percent } = await getBuyingPremiumFee(contracts[token.rel.platform], tokenData, contracts[token.rel.feesCalc], contracts[token.rel.feesModel], tokenAmount, cviValue, leverage, token.key);
        return { openFee: openFeeAmount.add(fee).mul(toBN(leverage)), buyingPremiumFeePercent: percent }
    } catch(error) {
        console.log(error);
        return "N/A";
    }   
}

const positionApi = {
    getOpenPositionFee
}

export default positionApi;