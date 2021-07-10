import { toBN } from "utils";

export async function toLPTokens(contracts, token, { tokenAmount }) {
  let totalSupply = toBN(await contracts[token.rel.platform].methods.totalSupply().call());
  let totalBalance = toBN(await contracts[token.rel.platform].methods.totalBalanceWithAddendum().call());
  return totalBalance.isZero() ? toBN(0) : tokenAmount.mul(totalSupply).div(totalBalance);
}

const liquidityApi = {
  toLPTokens
}

export default liquidityApi;