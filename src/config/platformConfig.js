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
    "index": "Index",
    "fee": "Funding fee",
  },
  trade: {
      "positions": "Open positions",
      "history": "History"
  },
  "view-liquidity": {
      "liquidity": "Liquidity",
      "history": "History"
  },
  "index": {
    [chainNames.Ethereum]: {
      "cvi": "CVI index",
    },
    [chainNames.Matic]: {
      "cvi": "CVI index",
    }
  }
};

const platformConfig = {
  tabs,
  tokens: {
    [chainNames.Ethereum]: {
      usdt: {
        key: "usdt",
        migrated: true,
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        type: "v1",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        rel: {
          contractKey: "USDT",
          platform: "USDTPlatform",
          feesCalc: "FeesCalculatorV2",
          feesModel: "FeesModelV2",
          oracle: "CVIOracle",
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
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        rel: {
          contractKey: "WETH",
          platform: "ETHPlatform",
          feesCalc: "FeesCalculatorV3",
          feesModel: "ETHPlatform",
          oracle: "CVIOracle",
          positionRewards: "PositionRewardsV2",
          stakingRewards: "ETHLPStakingRewards",
          liquidation: "Liquidation"
        },
      },
      usdc: {
        key: "usdc",
        decimals: 6,
        fixedDecimals: 2,
        lpTokensDecimals: 18,
        type: "usdc",
        leverage: ["1", "2"],
        rel: {
          contractKey: "USDC",
          platform: "ETHVolUSDCPlatform",
          feesCalc: "ETHVolUSDCFeesCalculator",
          feesModel: "ETHVolUSDCPlatform",
          positionRewards: "ETHVolUSDCPositionRewards",
          oracle: "CVIOracle",
          stakingRewards: "ETHVolUSDCLPStakingRewards",
          liquidation: "ETHVolUSDCLiquidation"
        }
      },
      coti: {
        key: "coti",
        soon: true,
        rel: {
          oracle: "CVIOracle"
        }
      },
    },
    [chainNames.Matic]: {
      usdt: {
        key: "usdt",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        type: "v2",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        rel: {
          contractKey: "USDT",
          platform: "USDTPlatform",
          feesCalc: "FeesCalculatorV4",
          feesModel: "USDTPlatform",
          positionRewards: "PositionRewardsV3",
          oracle: "CVIOracle",
          stakingRewards: "USDTLPStakingRewards",
          liquidation: "LiquidationV2"
        },
      },
      usdc: {
        key: "usdc",
        decimals: 6,
        fixedDecimals: 6,
        lpTokensDecimals: 18,
        type: "usdc",
        leverage: ["1", "2"],
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        rel: {
          contractKey: "USDC",
          platform: "USDCPlatform",
          feesCalc: "USDCFeesCalculator",
          feesModel: "USDCPlatform",
          positionRewards: "USDCPositionRewards",
          oracle: "CVIOracle",
          stakingRewards: "USDCLPStakingRewards",
          liquidation: "LiquidationV2"
        }
      },
    }
  },
  headers: {
    "stats": { 
      "Index": {
        label: "Index"
      }, 
      "Liquidity pools": {
        label: "Liquidity pools",
        tooltip: {
          content: "The total value locked in all liquidity pools of CVI and ETHVOL platforms in USD.",
          left: -30
        }
      }, 
      "Open positions": {
        label: "Open positions",
        tooltip: {
          content: "The total value of open positions in CVI and ETHVOL platforms in USD.",
          left: -30
        }
      }, 
    },
    "index": ["Index", "Previous hour", "Last week high", "Last week low"],
    [activeViews.trade]: {
      [tabs.trade.positions]: {
        index: {
          label: "Index"
        },
        "Value": {
          label: "Value"
        },
        "Leverage": {
          label: "Leverage"
        },
        "P&L": {
          label: "P&L",
          tooltip: {
            content: "Profit and loss of your position is calculated continuously and is based on the index change, purchase and funding fees.",
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
      "History": ["Action date", "Action type", "Index", "Value", "Leverage", "Amount", "Fees", "Net amount"],
    },
    [activeViews["view-liquidity"]]:  {
      [tabs['view-liquidity'].liquidity]: {
        index: {
          label: "Index"
        },
        "My liquidity (pool share)": {
          label: "My liquidity (pool share)"
        },
        "P&L": {
          label: "P&L",
          tooltip: {
            content: "Profit and loss is calculated continuously and is based on the index change, incoming funding fees that traders pay, and your share of the pool.",
            left: -30,
          }
        },
        "Pool size": {
          label: "Pool size"
        },
        action: ""
      },
      "History":  ["Action date", "Action type", "Index", "Amount"],
    }, 
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
  migrationMsgs: {
    [chainNames.Ethereum]: {
      trade: ["We have started the migration process of the USDT liquidity pool to USDC. Therefore, we have close the option to open new positions in the USDT pool.",
      "The new UDSC pool will be available on Wednesday 17th of November, at 13:00 UTC"],

      liquidity: ["We have started the migration process of the USDT liquidity pool to USDC. Therefore, we have close the option to provide new liquidity to the USDT pool.",
      "The new UDSC pool will be available on Wednesday 17th of November, at 13:00 UTC"]
    },
    [chainNames.Matic]: {
      trade: ["We have started the migration process of the USDT liquidity pool to USDC.",
      "Therefore, we have close the option to open new positions in the USDT pool."],

      liquidity: ["We have started the migration process of the USDT liquidity pool to USDC.",
      "Therefore, we have close the option to provide new liquidity to the USDT pool."],
    }
  },
  sellFeeWarningDuration: (60 * 60) * 48,
  sellFeeWarningText: "Sell fee will be considerably higher than usual until 48 hours pass from your last purchase",
}

export default platformConfig;