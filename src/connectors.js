import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { NetworkConnector } from '@web3-react/network-connector';

export const defaultChainId = process.env.REACT_APP_ENVIRONMENT === "staging" ? 31337 : 1;

export const chainNames = {
    Matic: "Matic",
    Ethereum: "Ethereum"
}

export const supportedNetworksConfig = {
    "mainnet": {
        // 1
        1: {
            chainId: '0x1',
            chainName: 'Ethereum',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: "https://eth-mainnet.alchemyapi.io/v2/KhQWOrbOeWZoTIkwRt4a4aXPPxx5wj5J",
            blockExplorerUrls: ['https://etherscan.com']
        },
        // matic
        137: {
            chainId: '0x89',
            chainName: 'Matic',
            nativeCurrency: {
                name: 'Matic',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: 'https://rpc-mainnet.maticvigil.com',
            blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
        },
    },
    "staging": {
        31337: {
            chainId: '0x7A69',
            chainName: 'Ethereum',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: 'https://staging-ethereum.cvi.finance',
            blockExplorerUrls: null
        },
        // matic testnet mumbai
        // 80001: {
        //     chainId: '0x13881',
        //     chainName: 'Matic',
        //     nativeCurrency: {
        //         name: 'Matic',
        //         symbol: 'tMATIC',
        //         decimals: 18
        //     },
        //     rpcUrls: ['https://polygon-mumbai.infura.io/v3/febfb2edfb47420784373875242fd24d'], // https://matic-testnet-archive-rpc.bwarelabs.com
        //     blockExplorerUrls: ['https://matic.network']
        // },
        31338: {
            chainId: '0x7A6A',
            chainName: 'Matic',
            nativeCurrency: {
                name: 'Matic',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: 'https://staging-polygon.cvi.finance', // https://matic-testnet-archive-rpc.bwarelabs.com
            blockExplorerUrls: ['https://matic.network']
        },
    }
}

export const supportedNetworksConfigByEnv = supportedNetworksConfig[process.env.REACT_APP_ENVIRONMENT]

export const networksFormatted = {
    "mainnet": {
        1: {
            name: "Ethereum",
            icon: "ethereum.svg"
        },
        137: {
            name: "Polygon (Matic)",
            icon: "matic.svg"
        },
    },
    "staging": {
        31337: {
            name: "Ethereum",
            icon: "ethereum.svg"
        },
        // 80001: {
        //     name: "Polygon (Matic)",
        //     icon: "matic.svg"
        // },
        31338: {
            name: "Polygon (Matic)",
            icon: "matic.svg"
        },
    }
}

export const graphEndpoints = {
    "mainnet": {
        1: "https://api.thegraph.com/subgraphs/name/vladi-coti/cvi",
        137: "https://api.thegraph.com/subgraphs/name/vladi-coti/cvi-polygon",
    },
    "staging": {
        31337: "https://api.thegraph.com/subgraphs/name/vladi-coti/cvi",
        31338: "https://api.thegraph.com/subgraphs/name/vladi-coti/cvi-polygon",
    }
}

export const networksFormattedByEnv = networksFormatted[process.env.REACT_APP_ENVIRONMENT]; 

const POLLING_INTERVAL = 12000;

const RPC_URLS = {
    "mainnet": {
        1: supportedNetworksConfig.mainnet[1].rpcUrls,
        137: supportedNetworksConfig.mainnet[137].rpcUrls,
    },
    "staging": {
        31337: supportedNetworksConfig.staging[31337].rpcUrls,
        31338: supportedNetworksConfig.staging[31338].rpcUrls,
    },
}
const RPC_URLS_BY_ENV = RPC_URLS[process.env.REACT_APP_ENVIRONMENT];

const RPC_URLS_NETWORK = {
    "mainnet": {
        1: "https://eth-mainnet.alchemyapi.io/v2/KhQWOrbOeWZoTIkwRt4a4aXPPxx5wj5J",
        137: "https://polygon-mainnet.infura.io/v3/febfb2edfb47420784373875242fd24d",
    },
    "staging": {
        31337: "https://staging-ethereum.cvi.finance",
        31338: "https://staging-polygon.cvi.finance",
    },
}
export const RPC_URLS_NETWORK_BY_ENV = RPC_URLS_NETWORK[process.env.REACT_APP_ENVIRONMENT]

export const injected = new InjectedConnector({ supportedChainIds: Object.keys(supportedNetworksConfig[process.env.REACT_APP_ENVIRONMENT]).map(id => Number(id))});

export const network = new NetworkConnector({
    defaultChainId,
    urls: RPC_URLS_NETWORK_BY_ENV,
})

const walletconnectorInstance = new WalletConnectConnector({
    rpc: { [defaultChainId]: RPC_URLS_BY_ENV[defaultChainId]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    qrcodeModalOptions: {
        mobileLinks: [
            "metamask",
            "trust",
        ],
    },
});

export let walletconnect = walletconnectorInstance

export const ConnectorNames = {
    MetaMask: 'MetaMask',
    WalletConnect: 'WalletConnect',
    Network: 'Network'
}
  
export let connectorsByName = {
    [ConnectorNames.MetaMask]: injected,
    [ConnectorNames.Network]: network,
    [ConnectorNames.WalletConnect]: walletconnect
}

export const reInitiateConnector = () => {
    connectorsByName = null;
    
    connectorsByName = {
        [ConnectorNames.MetaMask]: injected,
        [ConnectorNames.Network]: network,
        [ConnectorNames.WalletConnect]: new WalletConnectConnector({
            rpc: { [defaultChainId]: RPC_URLS_BY_ENV[defaultChainId] },
            bridge: 'https://bridge.walletconnect.org',
            qrcode: true,
            pollingInterval: POLLING_INTERVAL,
            qrcodeModalOptions: {
                mobileLinks: [
                    "metamask",
                    "trust",
                ],
            },
        })
    }
}