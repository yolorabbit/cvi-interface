import { chainNames } from "connectors";

const config = {
  oraclesData: {
    "cvi": {
      oracleId: "cvi",
      maxIndex: "20000"
    },
    "ethvi": {
      oracleId: 'ethvi',
      maxIndex: "22000"
    }
  },
  lockupPeriod: {
    sell: 'buyersLockupPeriod',
    withdraw: 'lpsLockupPeriod',
    unstake: 'stakeLockupTime'
  },
  maintenanceNetworks: {
    [chainNames.Ethereum]: false,
    [chainNames.Matic]: false,
  },
  isMainnet: process.env.REACT_APP_ENVIRONMENT === "mainnet",
  routes: {
    home: {
      label: "Home",
      path: "/",
      hide: ['/', '/platform', '/staking', '/index'],
      enterApp: true
    },
    platform: {
      label: "Platform",
      path: '/platform',
      hide: ['/'],
      restricted: true // block access by country
    },
    staking: {
      label: "Staking",
      path: '/staking',
      hide: ['/'],
      restricted: true // block access by country
    },
    analytics: {
      label: "Analytics",
      path: 'https://dune.xyz/govidev/CVI',
      external: true
    },
    "help-center": {
      label: "Docs",
      path: 'https://docs.cvi.finance',
      external: true
    },
  },
  socialLinks: [
    { iconName: 'github', to: 'https://github.com/coti-io/cvi-contracts' },
    { iconName: 'telegram', to: 'https://t.me/cviofficial' },
    { iconName: 'twitter', to: 'https://twitter.com/official_cvi' },
    { iconName: 'medium', to: 'https://cviofficial.medium.com' },
    { iconName: 'defipulse', to: 'https://defipulse.com/crypto-volatility-index' },
    { iconName: 'discord', to: 'https://discord.gg/jXba8HmTs5' },
  ],
  alerts: {
    types: {
       PROCESSING: "PROCESSING",
       CONFIRMED: "CONFIRMED",
       FAILED: "FAILED",
       NOTICE: "NOTICE"
    },
  },
  cviVolInfoCurrencyIndex: { // index of api.cvx.finance/cvx (cvxInfo[index][cviInfCurrencyIndex])
    CVI: 1,
    BTC: 2,
    ETH: 3
  },
  volatilityKey: { // @TODO: refactor this config
    "cvi": "cvi",
    "ethvi": "ethvi",
  },
  volatilityOracles: {
    "CVIOracle": "cvi",
    "ETHVOL-Oracle": "ethvi",
  },
  volatilityLabel: {
    "cvi": "CVI",
    "ethvi": "ETHVI",
  },
  volatilityApiKey: {
    "cvi": "CVI",
    "ethvi": "ETHVOL",
  },
  oracles: {
    "cvi": "CVOL-Oracle",
    "ethvi": "ETHVOL-Oracle"
  },
  web3ProviderId: "NETWORK",
  networkStatuses: {
     pending: 'pending',
     connected: 'connected',
     disconnected: 'disconnected'
  },
  walletErrors: {
    network: {
       wrong: {
          type: 'wrong-network',
          class: 'wrong-network',
          title: "Wrong Network",
       }
    }
  },
  statisticsDetails: {
    totalValueLocked: {
      title: "Platform TVL",
      className: "bold green",
      prefix: "$",
      tooltip: {
        content: "The total value locked(TVL) in both CVI and ETHVI platforms in USD",
        left: -30,
      }
    },
    goviPrice: {
      title: "GOVI price",
      prefix: "$",
      className: "bold"
    },
    feesCollected: {
      title: "Accumulated fees earned by GOVI stakers",
      className: "bold green",
      prefix: "$",
    },
    collateralRatio: {
      title: "Collateral ratio",
      tooltip: {
        content: "The collateral ratio is the ratio between the potential maximum value of open positions(open positions value when CVI index is 200) and the total value locked in the platform.",
        left: "0",
        mobileLeft: -40,
      }
    },
    purchaseFee: {
      title: "Purchase fee",
      tooltip: {
        content: "A purchase fee is a fee that you pay every time you buy a CVI position. The fee amount will increase if the collateral ratio is above 65% or in case of rapid changes in CVI value (turbulence).",
        left: "0",
        mobileLeft: -40,
      }
    },
    openPositionReward: {
      title: "Open position reward",
      tooltip: {
        content: "You will be able to claim the maximum reward if you keep your position open for at least 48 hours.",
        left: "0",
        mobileLeft: -40,
      }
    },
    fundingFee: {
      title: "Funding fee / hour",
      tooltip: {
        content: "A funding fee is an amount you pay every hour until you sell your CVI position or until the position is liquidated. A funding fee is not constant and may change based on the CVI index value.",
        left: "0",
        mobileLeft: -40,
      }
    },
    slippageTolerance: {
      title: "Slippage tolerance",
      tooltip: {
        content: "Your transaction will revert if the price changes unfavorably by more than this percentage",
        left: "0",
        mobileLeft: -40,
      }
    }
  },
  faq: {
    left: {
      sections: [{
        title: "Index",
        questions: [{
          title: "What is the CVI index?",
          content: [
            'CVI is created by computing a decentralized volatility index from cryptocurrency option prices together with analyzing the market’s expectation of future volatility.',
            { type: 'br' },
            { type: 'br' },
            'By computing a decentralized volatility index (CVI) from cryptocurrency option prices, the new system analyzes the market’s expectation of future volatility. COTI’s method addresses the challenging liquidity environment of this evolving asset class and allows us to extract the needed data to evaluate implied volatilities.'
          ]
        }, {
          title: "What is the range of values, and what does it represent?",
          content: [
            'The range of values for COTI CVI index',
            {
              type: 'b',
              text: ' is in the 0-200 range.'
            },
            ' Our historical calculation of smoothed CVI for the period between 30.03.2019 to 26.11.2020 gives us the',
            {
              type: 'b',
              text: ' mean value on 82'
            },
            ' (one index point is equivalent to one volatility percent point), the minimum value 49.3 reached on 30.01.2019, and the maximum value 172.4 reached on 16.03.2020.',
            { type: 'br' },
            'COTI CVI index is based on',
            {
              type: 'link',
              text: "Black-Scholes option pricing model",
              class: 'link',
              to: "https://www.investopedia.com/terms/b/blackscholes.asp"
            },
            ', allowing the seller to build a hedging portfolio.Find the implied volatility of the asset – it is an evaluation of the asset risk given by traders risking their skin in the game. All indices of the VIX family are calculated as numerical integration of tradable option contracts parameters.'
          ]
        }]
      },
      {
        title: "GOVI governance token",
        questions: [{
          title: "What is GOVI?",
          content: [
            'The GOVI token is a governance token for CVI', { type: 'br' }, { type: 'br' },
            'CVI operates a permissionless and open-source protocol so any user can take part in the development of the network.', { type: 'br' }, { type: 'br' },
            'CVI includes a decentralized governance component, where holders of the GOVI token can vote on matters such as the tradable assets, leverage used, deposit amounts, platform fees and more.', { type: 'br' }, { type: 'br' },
            'By staking their GOVI tokens, GOVI holders will also share fees from the CVI platform.'
          ]
        },
        {
          title: "How do I get GOVI",
          content: [
            'For now, GOVI is available on Uniswap.',
            { type: 'br' },
            'Traders can get GOVI tokens by buying positions on CVI platform. In order to earn GOVI tokens as a liquidity provider, you need to stake LP tokens you get for providing liquidity in the Manage your tokens tab.'
          ]
        },
        {
          title: "Is GOVI tradable?",
          content: 'The token is ERC20 and can be registered for trading in any decentralized exchange like any other ERC20 token.'
        },
        {
          title: "Where can I find the contract and the relevant addresses?",
          content: [
            'CVI platform contract addresses are published',
            {
              type: 'link',
              text: "here",
              class: 'link',
              to: `https://github.com/coti-io/cvi-contracts`
            }
          ]
        }]
      },
      {
        title: "Trading platform",
        questions: [{
          title: "Why should I trade on the CVI platform?",
          content: [
            `Trading volatility is a great way to find profitable trading opportunities in the market without having to predict the direction of the price. Traders make a profit on increased volatility, whether the price goes up or down. 
                We have created the CVI trading platform so that traders can hedge themselves against volatility or lack thereof. `,
            { type: 'br' },
            { type: 'br' },
            {
              type: 'span',
              class: 'underline',
              text: 'Hedge against impermanent loss:'
            },
            ' Liquidity providers for platforms such as uniswap are exposed to impermanent loss when one of the provided assets raises/drops faster than the other asset. Taking a position on CVI can allow liquidity providers to hedge against volatility in both directions.'
          ]
        },
        {
          title: "What is the connection between the CVI index and the platform?",
          content: [
            'The platform is an instrument (system) allowing traders to open positions against the index. Therefore, as part of the CVI index launch, we are also introducing an innovative decentralized trading platform.',
            { type: 'br' },
            'Combining all the parts together, we believe we can offer the crypto market an efficient and safe financial instrument.'
          ]
        },
        {
          title: "How does the CVI value affect my position? May I have some samples?",
          content: `COTI CVI trading model for now allows traders to take only long positions and liquidity providers take short positions. It means that if a trader bought 10 positions, 1 ETH each, at the CVI level of 60 and afterwards, the CVI index rose up to 70, the trader earned 1.6 ETH.
             Otherwise, if the CVI index fell to 50, the trader lost 1.6 ETH.. The ones taking the risks and losing in the event you win are the liquidity providers. Obviously, the expectation of this trade depends on the level of the index at which a trader bought the position.
             To even the odds, traders are paying the funding fee to liquidity providers. The funding fee level is derived from our historical simulations to make this trade equal for all CVI values.
             `
        }]
      },
      ]
    },
    right: {
      sections: [{
        title: "Trading",
        questions: [
          // {
          //   title: "Which countries are supported?",
          //   content: [
          //     "Our service supports users from all over the world. However, users from the following countries are not allowed to use CVI Platform in order to trade cryptocurrencies, for regulation rules.",
          //     {
          //       type: "ul",
          //       class: "faq-ul-list",
          //       list: [
          //         "Albania",
          //         "Bahamas",
          //         "Barbados",
          //         "Botswana",
          //         "Cambodia",
          //         "Cuba",
          //         "Democratic People's Republic of Korea (North Korea)",
          //         "Estonia",
          //         "Ghana",
          //         "Gibraltar",
          //         "Iceland",
          //         "Iran",
          //         "Iraq",
          //         "Israel",
          //         "Jamaica",
          //         "Kyrgyzstan",
          //         "Lebanon",
          //         "Mauritius",
          //         "Mongolia",
          //         "Myanmar",
          //         "Nicaragua",
          //         "Pakistan",
          //         "Panama",
          //         "Sudan",
          //         "Syria",
          //         "Trinidad and Tobago",
          //         "United States",
          //         "Uganda",
          //         "Yemen",
          //         "Zimbabwe"
          //       ]
          //     }
          //   ]
          // },
          {
            title: "Do you have a quick guide for trading?",
            content: [
              "Yes. A quick guide for traders can be found",
              {
                type: 'link',
                text: "here.",
                class: 'link',
                to: `/files/trading-quick-guide.pdf`
              }]
          },
          {
            title: "How can I become a trader?",
            content: `In order to trade in the platform, all you have to do is to connect your Metamask or WalletConnect wallet → go to “Platform” → click on “Manage your positions” →  select the currency you want to buy the CVI index with → insert the amount → Click on “Buy”. 
                   Please note that you will also get GOVI tokens each time you buy CVI position. You can claim them to your wallet in the Claim tab.`
          },
          {
            title: "How can I become a liquidity provider?",
            content: `
                In order to provide liquidity, first connect your Metamask or connect with WalletConnect. Afterwards go to “Platform” → click on “Manage your liquidity” → select the currency you want to deposit → insert the amount you wish to deposit → Click on “Deposit”.
                Liquidity providers also earn a share of the pool premiums based on the amount of liquidity they provide and the time during which their liquidity remains in the pool. Once you deposit liquidity you will get an LP token that you can stake in the “Manage your tokens” → Stake tab to earn GOVI tokens rewards`
          },
          {
            title: "How can I withdraw my funds as a liquidity provider?",
            content: `In order to withdraw your funds, all you have to do is to log into your personal wallet → go to “Platform” → Manage your liquidity →Withdraw tab, select currency and insert the amount you wish to withdraw → Click on “Withdraw”.
                Please note that in cases when the platform is a high utilization ratio, withdrawal can be temporarily limited in order to cover pre-existing open positions.`
          },
          {
            title: "How can I sell my position?",
            content: `In order to sell your position, all you have to do is to log into your personal wallet → go to “Platform” → Manage your positions →Sell tab, select currency and insert the amount you wish to sell → Click on “Sell”`
          },
          {
            title: "How do I estimate the time left before liquidation?",
            content: `The estimated time left before liquidation is - given the daily funding fee for the current CVI index, how long will it take the positions you hold to reach the liquidation threshold.
                This is of course an estimation, as the CVI index might change during that time, which would affect the funding fee paid as well as the value of the position itself.`
          },
          {
            title: "How is my P&L calculated?", //eslint-disable-next-line
            content: `For a trader, the profit is calculated based on the difference between the current CVI index value and one\s at the position\s opening times. This in addition to any fees that were collected or accrued during the above period. For a liquidity provider or an owner of LP Token, the profit depends on the collected funding fees and buying premium as well as your relative share in the liquidity pool. In addition the ongoing changes of the CVI Index impact the overall value.`
          },
          {
            title: "How is the purchase fee calculated?",
            content: [
              'The purchase fee is a combination of two fees.', { type: 'br' },
              'One is a fixed percentage from the amount used in the open position, while the second is the buying premium which is added in case the platform utilization factor (the capacity of the platform by the liquidity providers to cover the opened positions) is high in relation to it. In addition, buying premium is also affected by rapid changes in the CVI. In cases where the CVI value gathered by the oracle surpasses a predefined threshold percentage from the previously reported one, the system will be presented with the new value ahead of time which, in turn, will trigger an increase in premium. The component of the turbulence will diminish over time according to subsequent reports from the oracle unless large fluctuations continue.',
            ]
          },
          {
            title: "What is the Funding fee and how do I calculate it?",
            content: [
              `The funding fee is calculated according to the CVI Index value over time (per day). The higher the CVI value, the lower the funding fee percentage. The funding fee rate is updated according to new values of the CVI Index. You can read more about the Funding fee in the`,
              {
                type: 'link',
                text: "CVI whitepaper.",
                class: 'link',
                to: `/files/cvi-white-paper.pdf`
              }
            ]
          },
        ]
      },
      ]
    },
  },
  migrationStepsTypes: {
    'start': 'start',
    'no-need': 'no-need',
    'unstake': 'unstake', 
    'liquidity': 'liquidity', 
    'approved': 'approved', 
    'migrate': 'migrate', 
  },
  migrationSteps: [
    {
      stepKey: 'start',
      stepVisibility: false,
      stepDesc: [
        <b>Dear user,</b>, 
        "We are migrating the CVI Platform from the USDT to USDC pools on both Ethereum and Polygon networks.",
        "Once the migration is complete, you will be rewarded with additional GOVI tokens. Kindly note that you will need to manually stake your new CVI-USDC LP tokens in order to continue receiving your GOVI rewards.",
        "We have also ceased the distribution of GOVI rewards for traders and liquidity providers of the USDT pool.",
        "To proceed with the migration, please click the button below."
      ],
      stepButton: ["Proceed"]
    },
    {
      stepKey: 'unstake',
      stepVisibility: true,
      stepTitle: "Unstake & Claim",
      stepDesc: ["Unstake your USDT LP tokens and claim your GOVI rewards"],
      stepButton: ["Unstake"]
    }, {
      stepKey: "approved",
      stepVisibility: true,
      stepTitle: "Migrate",
      stepDesc: [
        <span className="bold">
          Clicking the migrate button will perform the following actions:
        </span>,
        ["1. Withdraw", "receive-value"],
        "2. Swap USDT for USDC.",
        "3. Deposit USDC to USDC liquidity pool."
      ],
      stepButton: ["Approve", "Migrate"], 
    }, {
      stepKey: "liquidity",
      stepVisibility: true,
      stepTitle: "Receive",
      stepDesc: [
        <span className="bold float-left">Congratulations!</span>,
        " You have successfully completed the migration.",
        'rewards-id',
        " will be sent to the following address shortly:",
      ]
    }
  ]
}

export default config;
