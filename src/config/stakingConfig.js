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
          fixedDecimals: 8,
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
          fixedDecimals: 8,
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
          fixedDecimals: 8,
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
          protocol: stakingProtocols.uniswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          rel: {
            stakingRewards: "COTIETHStakingRewards",
            tokenDecimals: [18],
            token: "UNIV2COTIETH"
          }
        },
        "govi-eth-lp": {
          key: "govi-eth-lp",
          protocol: stakingProtocols.uniswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          rel: {
            stakingRewards: "GOVIETHStakingRewards",
            tokenDecimals: [18],
            token: "UNIV2GOVIETH"
          }
        },
        "rhegic2-eth-lp": {
          key: "rhegic2-eth-lp",
          label: "rHEGIC2-ETH LP",
          protocol: stakingProtocols.uniswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          rel: {
            stakingRewards: "RHEGIC2ETHStakingRewards",
            tokenDecimals: [18],
            token: "UNIV2RHEGIC2ETH"
          }
        },
      },
      [stakingProtocols.sushiswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.sushiswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          rel: {
            stakingRewards: "COTIETHSLPStakingRewards",
            tokenDecimals: [18],
            token: "SLPCOTIETH"
          }
        },
        "govi-eth-lp": {
          key: "govi-eth-lp",
          protocol: stakingProtocols.sushiswap,
          rewardsTokens: ["GOVI"],
          decimals: 18,
          fixedDecimals: 8,
          rel: {
            stakingRewards: "GOVIETHSLPStakingRewards",
            tokenDecimals: [18],
            token: "SLPGOVIETH"
          }
        },
      },
    },
    [chainNames.Matic]: {
      [stakingProtocols.platform]: {
        "cvi-usdt-lp": {
          key: "cvi-usdt-lp",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          rel: {
            platform: "USDTPlatform",
            stakingRewards: "USDTLPStakingRewards",
            token: "USDT",
            tokenDecimals: [18]
          }
        },
        // "cvi-eth-lp": {
        //   key: "cvi-eth-lp",
        //   protocol: stakingProtocols.platform
        // },
        "govi": {
          key: "govi",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["USDT", "WETH"],
          rel: {
            stakingRewards: "StakingV2",
            tokenDecimals: [6, 18]
          }
        }
      },
      [stakingProtocols.quickswap]: {
        "govi-eth-lp": {
          key: "govi-eth-lp",
          protocol: stakingProtocols.quickswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          rel: {
            stakingRewards: "GOVIETHStakingRewards",
            token: "UNIV2GOVIETH",
            tokenDecimals: [18]
          }
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
        "coti-eth-lp": "COTI-ETH LP",
        "govi-eth-lp": "GOVI-ETH LP",
        "rhegic2-eth-lp": "RHEGIC2-ETH LP",
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