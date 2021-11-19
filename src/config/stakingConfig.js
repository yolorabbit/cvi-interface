import { chainNames } from "connectors";
import config from "./config";

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
          disable: config.isMainnet,
          migrated: true,
          key: "cvi-usdt-lp",
          label: "CVI-USDT LP",
          address: "0xe0437BeB5bb7Cf980e90983f6029033d710bd1da",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
          type: "lp-v1",
          rel: {
            contractKey: "CVOL-USDT-Platform",
            platform: "CVOL-USDT-Platform",
            stakingRewards: "CVOL-USDTLP-StakingRewards",
            token: "USDT",
            tokenDecimals: [18]
          }
        },
        "cvi-eth-lp": {
          key: "cvi-eth-lp",
          label: "CVI-ETH LP",
          address: "0x5005e8Dc0033E78AF80cfc8d10f5163f2FcF0E79",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          type: "lp-v1",
          rel: {
            contractKey: "CVOL-ETH-Platform",
            platform: "CVOL-ETH-Platform",
            stakingRewards: "CVOL-ETHLP-StakingRewards",
            token: "WETH",
            tokenDecimals: [18]
          }
        },
        "cvi-usdc-lp": {
          key: "cvi-usdc-lp",
          label: "CVI-USDC LP",
          address: "0x50Ab55dAD894503C2fDdd9B3a4130Dbfb926D472",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          type: "lp-v2",
          rel: {
            contractKey: "CVOL-USDC-Platform",
            platform: "CVOL-USDC-Platform",
            stakingRewards: "CVOL-USDCLP-StakingRewards",
            token: "USDC",
            tokenDecimals: [18]
          }
        },
        "govi": {
          key: "govi",
          label: "GOVI",
          address: "0xeeaa40b28a2d1b0b08f6f97bb1dd4b75316c6107",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["USDT", "WETH", "USDC"],
          type: "lp-v1",
          rel: {
            contractKey: "GOVI",
            stakingRewards: "Staking",
            tokenDecimals: [6, 18, 6]
          }
        }
      },
      [stakingProtocols.uniswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          label: "COTI-ETH LP",
          address: "0xa2b04f8133fc25887a436812eae384e32a8a84f2",
          protocol: stakingProtocols.uniswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          poolLink: "https://v2.info.uniswap.org/pair/0xa2b04f8133fc25887a436812eae384e32a8a84f2",
          rel: {
            stakingRewards: "COTIETH-StakingRewards",
            tokenDecimals: [18],
            contractKey: "UNIV2COTIETH",
            token: "UNIV2COTIETH"
          }
        },
        "govi-eth-lp": {
          key: "govi-eth-lp",
          label: "GOVI-ETH LP",
          address: "0x1ee312a6d5fe7b4b8c25f0a32fca6391209ebebf",
          protocol: stakingProtocols.uniswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          poolLink: "https://v2.info.uniswap.org/pair/0x1ee312a6d5fe7b4b8c25f0a32fca6391209ebebf",
          rel: {
            stakingRewards: "GOVIETH-StakingRewards",
            tokenDecimals: [18],
            contractKey: "UNIV2GOVIETH",
            token: "UNIV2GOVIETH"
          }
        },
        "rhegic2-eth-lp": {
          disable: true,
          key: "rhegic2-eth-lp",
          label: "rHEGIC2-ETH LP",
          address: "0x51996fc38c8d839abd6c2db9a4c221df1cb487a0",
          protocol: stakingProtocols.uniswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          poolLink: "https://v2.info.uniswap.org/pair/0x51996fc38c8d839abd6c2db9a4c221df1cb487a0",
          rel: {
            stakingRewards: "RHEGIC2ETH-StakingRewards",
            tokenDecimals: [18],
            contractKey: "UNIV2RHEGIC2ETH",
            token: "UNIV2RHEGIC2ETH"
          }
        },
      },
      [stakingProtocols.sushiswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          label: "COTI-ETH SLP",
          address: "0x717385e1a702f90b6eb8cd23150702ca7217b626",
          protocol: stakingProtocols.sushiswap,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          poolLink: "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xDDB3422497E61e13543BeA06989C0789117555c5",
          rel: {
            stakingRewards: "COTIETHSLP-StakingRewards",
            tokenDecimals: [18],
            contractKey: "SLPCOTIETH",
            token: "SLPCOTIETH"
          }
        },
        "govi-eth-lp": {
          key: "govi-eth-lp",
          label: "GOVI-ETH SLP",
          address: "0x7e6782e37278994d1e99f1a5d03309b4b249d919",
          protocol: stakingProtocols.sushiswap,
          rewardsTokens: ["GOVI"],
          decimals: 18,
          fixedDecimals: 8,
          poolLink: "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xeEAA40B28A2d1b0B08f6f97bB1DD4B75316c6107",
          rel: {
            stakingRewards: "GOVIETHSLP-StakingRewards",
            tokenDecimals: [18],
            contractKey: "SLPGOVIETH",
            token: "SLPGOVIETH"
          }
        },
      },
    },
    [chainNames.Matic]: {
      [stakingProtocols.platform]: {
        "cvi-usdt-lp": {
          disable: config.isMainnet,
          migrated: true,
          key: "cvi-usdt-lp",
          label: "CVI-USDT LP",
          address: "0x88D01eF3a4D586D5e4ce30357ec57B073D45ff9d",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          type: "lp-v1",
          rel: {
            contractKey: "CVOL-USDT-Platform",
            platform: "CVOL-USDT-Platform",
            stakingRewards: "CVOL-USDTLP-StakingRewards",
            token: "USDT",
            tokenDecimals: [18]
          },
        },
        "cvi-usdc-lp": {
          key: "cvi-usdc-lp",
          label: "CVI-USDC LP",
          address: "0x3863D0C9b7552cD0d0dE99fe9f08a32fED6ab72f",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["GOVI"],
          tokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
          type: "lp-v2",
          rel: {
            contractKey: "CVOL-USDC-Platform",
            platform: "CVOL-USDC-Platform",
            stakingRewards: "CVOL-USDCLP-StakingRewards",
            token: "USDC",
            tokenDecimals: [18]
          }
        },
        "govi": {
          key: "govi",
          label: "GOVI",
          address: "0x43Df9c0a1156c96cEa98737b511ac89D0e2A1F46",
          protocol: stakingProtocols.platform,
          decimals: 18,
          fixedDecimals: 8,
          rewardsTokens: ["USDT","USDC"],
          type: "lp-v1",
          rel: {
            contractKey: "GOVI",
            stakingRewards: "Staking",
            tokenDecimals: [6, 6]
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
          poolLink: "https://info.quickswap.exchange/pair/0x1dab41a0e410c25857f0f49b2244cd089ab88de6",
          address: "0x1dAb41a0E410C25857F0f49B2244Cd089AB88DE6",
          type: "lp-v1",
          rel: {
            stakingRewards: "GOVIETH-StakingRewards",
            token: "UNIV2GOVIETH",
            contractKey: "UNIV2GOVIETH",
            tokenDecimals: [18]
          }
        },
      }
    }
  },
  headers: {
    [stakingViews.staked]: {
      "Staked amount (pool share)": {
        label: "Staked amount (pool share)"
      },
      "APY": {
        label: "APY (Yearly)",
      },
      "TVL": {
        label: "TVL",
        "cvi-usdt-lp": "CVI-USDT LP",
        "cvi-usdc-lp": "CVI-USDC LP",
        "cvi-eth-lp": "CVI-ETH LP",
        "coti-eth-lp": "COTI-ETH LP",
        "govi-eth-lp": "GOVI-ETH LP",
        "ethvol-usdc-lp": "ETHVOL-ETH LP",
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
      [chainNames.Ethereum]: {
        0: "Platform tokens", // 0 - index to add the sub header
        4: "Liquidity mining"
      },
      [chainNames.Matic]: {
        0: "Platform tokens", // 0 - index to add the sub header
        3: "Liquidity mining"
      }
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