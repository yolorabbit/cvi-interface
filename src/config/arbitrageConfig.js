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
  },
  graphs: {
    "fulfilment": "Time to fulfilment fee",
    "penalty": "Time penalty fee",
  }
}

const arbitrageConfig = {
  tabs,
  tokens: {
    [chainNames.Ethereum]: {
      "ethvi": {
        key: "ethvi",
        name: "ethvi",
        decimals: 18,
        fixedDecimals: 8,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.ethvi.oracleId,
        rel: {
          contractKey: "ETHVOL-USDC-LONG",
          volTokenKey: "ETHVOL-USDC-LONG",
        },
        pairToken: {
          key: "usdc",
          name: "usdc",
          decimals: 6,
          fixedDecimals: 2,
          oracleId: config.oraclesData.ethvi.oracleId,
          rel: {
            contractKey: "USDC",
            volTokenKey: "ETHVOL-USDC-LONG",
          },
        },
        mintProperties: {
          label: "USDC",
          decimals: 6,
          fixedDecimals: 2,
          lpTokensDecimals: 18,
        },
        burnProperties: {
          label: "ETHVI",
          decimals: 18,
          fixedDecimals: 8,
          lpTokensDecimals: 18,
        }
      },
    },
    [chainNames.Matic]: {
      "cvol": {
        key: "cvol",
        name: "cvol",
        decimals: 18,
        fixedDecimals: 8,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.cvi.oracleId,
        rel: {
          contractKey: "CVOL-USDC-LONG",
          volTokenKey: "CVOL-USDC-LONG",
        },
        pairToken: {
          key: "usdc",
          name: "usdc",
          decimals: 6,
          fixedDecimals: 2,
          oracleId: config.oraclesData.cvi.oracleId,
          rel: {
            contractKey: "USDC",
            volTokenKey: "CVOL-USDC-LONG",
          }
        },
        mintProperties: {
          label: "USDC",
          decimals: 6,
          fixedDecimals: 2,
          lpTokensDecimals: 18,
        },
        burnProperties: {
          label: "CVOL",
          decimals: 18,
          fixedDecimals: 8,
          lpTokensDecimals: 18,
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
    "fulfill": {
      key: "fulfill"
    }
  },
  tables: {
    [activeTabs.mint]: {
      "pending": {
        headers: {
          type: "Type",
          amount: "Amount",
          submitTime: "Submit time",
          submitTimeToFulfillment: "Submitted time to fulfilment",
          timeToFulfillmentFee: "Time to fulfilment fee",
          upfrontPayment: "Up front payment",
          estimatedNumberOfTokens: "Estimated number of minted tokens",
          fulfillmentIn: "Fulfilment in",
          action: true
        }
      },
      "history": {
        headers: {
          type: "Type",
          amount: "Amount",
          timeToFulfillmentAndPenaltyFees: "Time to fulfilment and penalty fees",
          collateralMint: "Collateral mint",
          receivedToken: "Received tokens"
        }
      }
    },
    [activeTabs.burn]: {
      "pending": {
        headers: {
          type: "Type",
          amount: "Amount",
          submitTime: "Submit time",
          submitTimeToFulfillment: "Submitted time to fulfilment",
          timeToFulfillmentFee: "Time to fulfilment fee",
          upfrontPayment: "Up front payment",
          estimatedNumberOfTokens: "Estimated number of minted tokens",
          fulfillmentIn: "Fulfilment in",
          action: true
        }
      },
      "history": {
        headers: {
          type: "Type",
          amount: "Amount",
          timeToFulfillmentAndPenaltyFees: "Time to fulfilment and penalty fees",
          collateralMint: "Collateral mint",
          receivedToken: "Received tokens"
        }
      }
    },
  },
  requestType: {
    1: activeTabs.mint,
    2: activeTabs.burn,
    3: activeTabs.mint,
    Mint:activeTabs.mint,
    Burn:activeTabs.burn,
    CollateralizedMint:activeTabs.mint,
  }
}

export default arbitrageConfig;