import { chainNames } from "connectors";
import config from "./config";

export const activeViews = {
  "pending": "pending",
  "history": "history"
}

export const activeTabs = {
  "mint": "mint",
  "burn": "burn"
}

export const tabs = {
  "sub-navbar": {
    "mint": "Mint",
    "burn": "Burn"
  }
}

const arbitrageConfig = {
  tabs,
  tokens: {
    [chainNames.Ethereum]: {
      "usdc-ethvi": {
        key: "usdc-ethvi",
        name: "usdc",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        type: "v3",
        leverage: ["1", "2"],
        oracleId: config.oraclesData.ethvi.oracleId,
        rel: {
          contractKey: "USDC",
          platform: "ETHVOL-USDC-Platform",
          feesCalc: "ETHVOL-USDC-FeesCalculator",
          feesModel: "ETHVOL-USDC-Platform",
          positionRewards: "ETHVOL-USDC-PositionRewards",
          oracle: "ETHVOL-Oracle",
          stakingRewards: "ETHVOL-USDCLP-StakingRewards",
          liquidation: "ETHVOL-USDC-Liquidation"
        }
      },
    },
    [chainNames.Matic]: {
      "usdc-cvol": {
        key: "usdc-cvol",
        name: "usdc",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        type: "usdc",
        leverage: ["1", "2"],
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        oracleId: config.oraclesData.cvi.oracleId,
        rel: {
          contractKey: "USDC",
          platform: "CVOL-USDC-Platform",
          feesCalc: "CVOL-USDC-FeesCalculator",
          feesModel: "CVOL-USDC-Platform",
          positionRewards: "CVOL-USDC-PositionRewards",
          oracle: "CVOL-Oracle",
          stakingRewards: "CVOL-USDCLP-StakingRewards",
          liquidation: "CVOL-USDC-Liquidation"
        }
      },
    }
  },
  headers: {
    "stats": { 
      "Index": {
        label: "Index"
      }, 
      "Platform Price": {
        label: "Platform Price",
      }, 
      "Open positions": {
        label: "Uniswap Price",
      }, 
    }
  },
}

export default arbitrageConfig;