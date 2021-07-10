import { chainNames } from "connectors";

export const stakingViews = {
  "staked": "staked",
  "available-to-stake": "available-to-stake",
}

export const stakingProtocols = {
  "uniswap": "uniswap",
  "sushiswap": "sushiswap", 
  "quickswap": "quickswap",
  "platform": "platform"
}

const stakingConfig = {
  stakingConnectLabels: {
    [stakingViews.staked]: "staked assets" 
  },
  protocolsByNetwork: {
    [chainNames.Ethereum]: [stakingProtocols.uniswap, stakingProtocols.sushiswap],
    [chainNames.Matic]: [stakingProtocols.quickswap],
  },
  tokens: {
    [chainNames.Ethereum]: {
      [stakingProtocols.platform]: {
        "cvi-usdt-lp": {
          key: "cvi-usdt-lp",
          protocol: stakingProtocols.platform,
          decimals: 18,
          rewardsTokens: ["GOVI"],
          rel: {
            platform: "USDTPlatform",
            stakingRewards: "USDTLPStakingRewards",
            token: "USDT",
            tokenDecimals: [18]
          }
        },
        "cvi-eth-lp": {
          key: "cvi-eth-lp",
          protocol: stakingProtocols.platform,
          decimals: 18,
          rewardsTokens: ["GOVI"],
          rel: {
            platform: "ETHPlatform",
            stakingRewards: "ETHLPStakingRewards",
            token: "WETH",
            tokenDecimals: [18]
          }
        },
        "govi": {
          key: "govi",
          protocol: stakingProtocols.platform,
          decimals: 18,
          rewardsTokens: ["USDT", "WETH"],
          rel: {
            stakingRewards: "Staking",
            tokenDecimals: [6, 18]
          }
        }
      },
      [stakingProtocols.uniswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.uniswap
        },
        "govi-eth-lp": {
          key: "govi-eth-lp",
          protocol: stakingProtocols.uniswap
        },
        "rhegic2-eth-lp": {
          key: "rhegic2-eth-lp",
          label: "rHEGIC2-ETH LP",
          protocol: stakingProtocols.uniswap
        },
      },
      [stakingProtocols.sushiswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.sushiswap
        },
        "govi-eth-lp": {
          key: "govi-eth-lp",
          protocol: stakingProtocols.sushiswap
        },
      },
    },
    [chainNames.Matic]: {
      [stakingProtocols.platform]: {
        "cvi-usdt-lp": {
          key: "cvi-usdt-lp",
          protocol: stakingProtocols.platform
        },
        "cvi-eth-lp": {
          key: "cvi-eth-lp",
          protocol: stakingProtocols.platform
        },
        "govi": {
          key: "govi",
          protocol: stakingProtocols.platform
        }
      },
      [stakingProtocols.quickswap]: {
        "govi-eth-lp": {
          key: "govi-eth-lp",
          protocol: stakingProtocols.quickswap
        },
      }
    }
  },
  headers: {
    [stakingViews.staked]: {
      icon: "",
      "Staked amount (pool share)": {
        label: "Staked amount (pool share)"
      },
      "APY": {
        label: "APY (Yearly)",
      },
      "TVL": {
        label: "TVL",
        "cvi-usdt-lp": "CVI-USDT LP",
        "cvi-eth-lp": "CVI-ETH LP",
        "govi": "GOVI",
      },
      "Estimated rewards per day": {
        label: "Estimated rewards per day",
      },
      "Claimable rewards": {
        label: "Claimable rewards"
      },
      action: ""
    },
    [stakingViews["available-to-stake"]]: {
      "Assets": {
        label: "Assets"
      },
      "Your wallet balance": {
        label: "Your wallet balance",
      },
      "TVL": {
        label: "TVL",
      },
      "APY": {
        label: "APY",
      },
      action: ""
    },
  },
  tableSubHeaders: {
    [stakingViews["available-to-stake"]]: {
      0: "Platform tokens", // 0 - index to add the sub header
      3: "Liquidity mining"
    }
  },
  actionsConfig: {
    "unstake": {
        key: "unstake",
    },
    "stake": {
        key: "stake",
    },
    "claim": {
        key: "claim",
    }
  }
}

export default stakingConfig;