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
      "ethvi-usdc": {
        key: "ethvi-usdc",
        name: "ethvi",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.ethvi.oracleId,
        view: activeTabs.mint
      },
      "usdc-ethvi": {
        key: "usdc-ethvi",
        name: "usdc",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.ethvi.oracleId,
        view: activeTabs.burn
      },
    },
    [chainNames.Matic]: {
      "usdc-cvol": {
        key: "usdc-cvol",
        name: "usdc",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.cvi.oracleId,
        view: activeTabs.mint
      },
      "cvol-usdc": {
        key: "cvol-usdc",
        name: "cvol",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.cvi.oracleId,
        view: activeTabs.burn
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
  tablesInfo: {
    [activeTabs.mint]: {
      tabs: {
        [activeViews.pending]: "Pending requests",
        [activeViews.history]: "History"
      }
    },
    [activeTabs.burn]: {
      tabs: {
        [activeViews.pending]: "Pending requests",
        [activeViews.history]: "History"
      }
    }
  },
  actionsConfig: {
    "mint": {
        key: "mint",
    },
    "burn": {
        key: "burn",
    },
  }
}

export default arbitrageConfig;