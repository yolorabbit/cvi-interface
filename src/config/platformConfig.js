import { chainNames } from "connectors";

export const activeViews = {
  "trade": "trade",
  "view-liquidity": "view-liquidity",
  "history": "History"
}

const tabs = {
  "sub-navbar": {
      "trade": "Trade",
      "view-liquidity": "Provide Liquidity"
  },
  graphs: {
      "cvi index": "CVI Index",
      "funding fee": "Funding fee"
  },
  trade: {
      "positions": "Open trades",
      "history": "History"
  },
  "view-liquidity": {
      "liquidity": "Liquidity",
      "history": "History"
  }
};

const platformConfig = {
  tabs,
  tokens: {
    [chainNames.Ethereum]: {
      usdt: {
        key: "usdt",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        type: "v1",
        rel: {
          contractKey: "USDT",
          platform: "USDTPlatform",
          feesCalc: "FeesCalculatorV2",
          feesModel: "FeesModelV2",
          cviOracle: "CVIOracle",
          positionRewards: "PositionRewards",
          stakingRewards: "USDTLPStakingRewards",
          liquidation: "Liquidation",
          rewards: "Rewards",
        },
      },
      eth: {
        key: "eth",
        decimals: 18,
        fixedDecimals: 8,
        lpTokensDecimals: 18,
        type: "eth",
        rel: {
          contractKey: "WETH",
          platform: "ETHPlatform",
          feesCalc: "FeesCalculatorV3",
          feesModel: "ETHPlatform",
          cviOracle: "CVIOracle",
          positionRewards: "PositionRewardsV2",
          stakingRewards: "ETHLPStakingRewards",
          liquidation: "Liquidation"
        },
      },
      coti: {
        key: "coti",
        soon: true,
      },
    },
    [chainNames.Matic]: {
      usdt: {
        key: "usdt",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        type: "v2",
        rel: {
          contractKey: "USDT",
          platform: "USDTPlatform",
          feesCalc: "FeesCalculatorV4",
          feesModel: "USDTPlatform",
          positionRewards: "PositionRewardsV3",
          cviOracle: "CVIOracle",
          stakingRewards: "USDTLPStakingRewards",
          liquidation: "LiquidationV2"
        },
      },
      usdc: {
        key: "usdc",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        type: "usdc",
        leverage: ["X1", "X3", "X4"],
        rel: {
          contractKey: "USDC",
          platform: "USDCPlatform",
          feesCalc: "FeesCalculatorV4",
          feesModel: "USDCPlatform",
          positionRewards: "USDCPositionRewards",
          cviOracle: "CVIOracle",
          stakingRewards: "USDCLPStakingRewards",
          liquidation: "LiquidationV2"
        }
      },
    }
  },
  headers: {
    [activeViews.trade]: {
      [tabs.trade.positions]: {
        icon: "",
        "Value": {
          label: "Value"
        },
        "Leverage": {
          label: "Leverage"
        },
        "P&L": {
          label: "P&L",
          tooltip: {
            content: "Profit and loss of your position is calculated continuously and is based on the CVI index change, purchase and funding fees.",
            left: -30,
          }
        },
        "Rewards (claimable today)": {
          label: "Rewards (claimable today)",
          tooltip: {
            content: "Please note that GOVI tokens will become claimable starting the day after your last open position action (UTC time). If the available claimable amount is lower than your reward amount at the time of your claim, you can try again a day later and for a period of 30 days from the time of the last position purchase.",
            left: -30,
          }
        },
        action: ""
      },
      "History": ["Action date", "Action type", "CVI index value", "Leverage", "Amount", "Fees", "Net amount"]
    },
    [activeViews["view-liquidity"]]:  {
      [tabs['view-liquidity'].liquidity]: {
        icon: "",
        "My liquidity (pool share)": {
          label: "My liquidity (pool share)"
        },
        "P&L": {
          label: "P&L",
          tooltip: {
            content: "Profit and loss is calculated continuously and is based on the CVI index change, incoming funding fees that traders pay, and your share of the pool.",
            left: -30,
          }
        },
        "Pool size": {
          label: "Pool size"
        },
        action: ""
      },
      "History":  ["Action date", "Action type", "Amount"]
    }
  },
  actionsConfig: {
    "buy": {
        key: "buy",
    },
    "sell": {
        key: "sell",
    },
    "deposit": {
        key: "deposit",
    },
    "withdraw": {
        key: "withdraw",
    },
    "claim": {
        key: "claim",
    }
  },
  collateralRatios: {
    buy: {
       id: "buy",
       text: "Please note that when the collateral ratio is above 80%, the purchase fee will increase.",
       type: "negative",
       markedLevel: 80
    },
    deposit: {
       text: "Please note that when the collateral ratio is above 80%, the purchase fee will increase, resulting in higher profits for the liquidity providers.",
       type: "positive",
       markedLevel: 80
    }
  },
  lockupPeriod: {
    sell: 'buyersLockupPeriod',
    withdraw: 'lpsLockupPeriod'
  },
  sellFeeWarningDuration: (60 * 60) * 48,
  sellFeeWarningText: "Sell fee will be considerably higher than usual until 48 hours pass from your last purchase",
}

export default platformConfig;