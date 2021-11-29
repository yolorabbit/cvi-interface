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
      "usdc": {
        key: "usdc",
        name: "usdc",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.ethvi.oracleId,
        view: activeTabs.mint,
        rel: {
          contractKey: "USDC",
          volatilityToken: "ETHVOL-USDC-LONG" 
        }
      },
      "ethvi": {
        key: "ethvi",
        name: "ethvi",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.ethvi.oracleId,
        view: activeTabs.burn,
        rel: {
          contractKey: "ETHVOL-USDC-LONG",
          volatilityToken: "ETHVOL-USDC-LONG" 
        }
      },
    },
    [chainNames.Matic]: {
      "cvol": {
        key: "cvol",
        name: "cvol",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.cvi.oracleId,
        view: activeTabs.mint,
        rel: {
          contractKey: "ETHVOL-USDC-LONG",
          volatilityToken: "ETHVOL-USDC-LONG" 
        }
      },
      "usdc": {
        key: "usdc",
        name: "usdc",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        oracleId: config.oraclesData.cvi.oracleId,
        view: activeTabs.burn,
        rel: {
          contractKey: "USDC",
          volatilityToken: "ETHVOL-USDC-LONG" 
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
          submitTime: "Submit time",
          submitTimeToFulfillment: "Submitted time to fulfilment",
          fulfillmentTime: "Fulfilment time",
          timeToFulfillmentAndPenaltyFees: "Time to fulfilment and penalty fees",
          mintFee: "Mint fee",
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
        type: "Type",
        amount: "Amount",
        submitTime: "Submit time",
        submitTimeToFulfillment: "Submitted time to fulfilment",
        fulfillmentTime: "Fulfilment time",
        timeToFulfillmentAndPenaltyFees: "Time to fulfilment and penalty fees",
        mintFee: "Mint fee",
        collateralMint: "Collateral mint",
        receivedToken: "Received tokens"
      },
    },
  },
  requestType: {
    1: activeTabs.mint,
    2: activeTabs.mint,
    3: "collateralizedMint" 
  }
}

export default arbitrageConfig;