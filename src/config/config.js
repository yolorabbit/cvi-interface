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

export const activeViews = {
  "trade": "trade",
  "view-liquidity": "view-liquidity"
}

const config = {
    routes: {
        platform: {
            label: "Platform",
            path: '/platform'
        },
        staking: {
            label: "Staking",
            path: '/staking'
        },
        guides: {
            label: "Guides",
            path: '/guides'
        },
        about: {
            label: "About",
            path: '/about'
        }
    },
    tabs,
    socialLinks: [
        { iconName: 'github', to: 'https://github.com/coti-io/cvi-contracts' },
        { iconName: 'telegram', to: 'https://t.me/cviofficial' },
        { iconName: 'twitter', to: 'https://twitter.com/official_cvi' },
        { iconName: 'medium', to: 'https://cviofficial.medium.com' },
        { iconName: 'defipulse', to: 'https://defipulse.com' },
        { iconName: 'discord', to: 'https://discord.gg/jXba8HmTs5' },
    ],
    statisticsDetails: {
        totalValueLocked: {
          title: "Total value locked",
          className: "bold green",
          prefix: "$",
          tooltip: {
            content: "The total value locked(TVL) in the platform in USD",
            left: -30,
          }
        },
        liquidityPoolBalance: {
          title: "Liquidity pools",
          prefix: "$",
          tooltip: {
            content: "The total value locked in all liquidity pools in USD. It is the total value deposited into the platform by liquidity providers who expect the CVI index to drop or stay the same.",
            mobileLeft: -30,
          }
        },
        openTrades: {
          title: "Open trades",
          prefix: "$",
          tooltip: {
            content: "The total value of open positions in USD. Positions are bought by traders who expect the CVI index to increase.",
            mobileLeft: -30,
          }
        },
        goviPrice: {
          title: "GOVI price",
          prefix: "$",
        },
        feesCollected: {
          title: "Fees collected for GOVI holders",
          className: "bold green",
          prefix: "$",
        },
        totalGoviRewards: {
          title: "Today's rewards for new positions",
          className: "bold green",
          suffix: "GOVI"
        },
        collateralRatio: {
          title: "Collateral ratio",
          className: "bold",
          tooltip: {
            content: "The collateral ratio is the ratio between the potential maximum value of open positions(open positions value when CVI index is 200) and the total value locked in the platform.",
            left: "0",
            mobileLeft: -40,
          }
        },
    },
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

export default config;