import { toBN, toTokenAmount } from "utils";

async function getOpenPositionFeePercent(platform, feesCalc, tokenAmount) {
    let openFeePrecent = toBN(await feesCalc.methods.openPositionFeePercent().call());
    let maxFeePercent = toBN(await platform.methods.MAX_FEE_PERCENTAGE().call());
    return maxFeePercent !== 0 ? tokenAmount.mul(openFeePrecent).div(maxFeePercent) : 0;
}

async function getOpenPositionFee(contracts, token, {library, leverage, amount}) {
    try {
        console.log(contracts);
        console.log(token);
        console.log(amount);
        const { getCVILatestRoundData  } = contracts[token.rel.cviOracle].methods || {};
        const { cviValue } = getCVILatestRoundData ? await getCVILatestRoundData().call() : {};
        const tokenAmount = toTokenAmount(amount, token.decimals);

        console.log("getOpenPositionFee");
        let openFeeAmount = await getOpenPositionFeePercent(contracts[token.rel.platform], contracts[token.rel.feesCalc], tokenAmount);
        console.log(openFeeAmount.toString());
        return openFeeAmount;
        // ({ fee, percent } = await getBuyingPremiumFee(contracts[token.rel.platform], tokenData, feesCalc, feesModel, tokenAmount, cviValue, leverage, type));
        // return { openFee: openFeeAmount.add(fee).mul(toBN(leverage)), buyingPremiumFeePercent: percent };
    } catch(error) {
        console.log(error);
        return "N/A";
    }   
}

const positionApi = {
    getOpenPositionFee
}

export default positionApi;