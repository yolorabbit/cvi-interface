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
}

export default config;