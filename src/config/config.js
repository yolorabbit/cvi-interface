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
    tabs: {
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
    },
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
          tooltip: {
            content: "The total value locked(TVL) in the platform in USD",
            left: -30,
          }
        },
        liquidityPoolBalance: {
          title: "Liquidity pools",
          tooltip: {
            content: "The total value locked in all liquidity pools in USD. It is the total value deposited into the platform by liquidity providers who expect the CVI index to drop or stay the same.",
            left: "-100%",
            mobileLeft: -30,
          }
        },
        openTrades: {
          title: "Open trades",
          tooltip: {
            content: "The total value of open positions in USD. Positions are bought by traders who expect the CVI index to increase.",
            left: "-100%",
            mobileLeft: -30,
          }
        },
        goviPrice: {
          title: "GOVI price",
        },
        feesCollected: {
          title: "Fees collected for GOVI holders",
          className: "bold green",
        },
        totalGoviRewards: {
          title: "Today's rewards for new positions",
          className: "bold green",
          suffix: "GOVI"
        }
     },
}

export default config;