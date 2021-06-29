
export const chainNames = {
  Matic: "Matic",
  Ethereum: "Ethereum"
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
        "help-center": {
            label: "Help center",
            path: '/help'
        },
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
}

export default config;