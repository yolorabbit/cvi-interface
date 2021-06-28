
export const stakingViews = {
  "staked": "staked",
  "liquidity-mining": "liquidity-mining",
  "platform-tokens": "platform-tokens",
}

const stakingConfig = {
  // tokens: {
  //   "cvi-usdt-lp": {
  //     key: "cvi-usdt-lp"
  //   },
  //   "cvi-eth-lp": {
  //     key: "cvi-eth-lp"
  //   },
  //   "govi": {
  //     key: "govi"
  //   }
  // },
  tokens: ["cvi-usdt-lp", "cvi-eth-lp", "govi"],
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