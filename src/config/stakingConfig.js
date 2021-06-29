import { chainNames } from "./config";

export const stakingViews = {
  "staked": "staked",
  "liquidity-mining": "liquidity-mining",
  "platform-tokens": "platform-tokens",
}

export const stakingProtocols = {
  "uniswap": "uniswap",
  "sushiswap": "sushiswap", 
  "quickswap": "quickswap",
  "platform": "platform"
}

const stakingConfig = {
  protocolsByNetwork: {
    [chainNames.Ethereum]: [stakingProtocols.uniswap, stakingProtocols.sushiswap],
    [chainNames.Matic]: [stakingProtocols.quickswap],
  },
  tokens: {
    [chainNames.Ethereum]: {
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
      [stakingProtocols.uniswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.uniswap
        },
        "govi-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.uniswap
        },
        "rhegic2-eth-lp": {
          key: "rhegic2-eth-lp",
          label: "rHEGIC2-ETH-LP",
          protocol: stakingProtocols.uniswap
        },
      },
      [stakingProtocols.sushiswap]: {
        "coti-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.sushiswap
        },
        "govi-eth-lp": {
          key: "coti-eth-lp",
          protocol: stakingProtocols.sushiswap
        },
      },
    },
    [chainNames.Matic]: {
      [stakingProtocols.quickswap]: {
        "govi-eth-lp": {
          key: "coti-eth-lp",
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
        label: "APY",
      },
      "TVL": {
        label: "TVL",
      },
      "Estimated rewards per day": {
        label: "Estimated rewards per day",
      },
      "Claimable rewards": {
        label: "Claimable rewards"
      },
      action: ""
    },
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