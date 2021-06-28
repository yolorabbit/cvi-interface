export const activeViews = {
  "trade": "trade",
  "view-liquidity": "view-liquidity"
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
  tokens: ["usdt", "eth"],
  headers: {
    [activeViews.trade]: {
      [tabs.trade.positions]: {
        icon: "",
        "Value": {
          label: "Value"
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
        "Leverage": {
          label: "Leverage"
        },
        "Estimated Liquidation": {
          label: "Estimated Liquidation",
          tooltip: {
            content: "Estimated number of days until your position is liquidated. The calculation is based on the current funding fee amount and will change if the funding fee changes.",
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
  }
}

export default platformConfig;