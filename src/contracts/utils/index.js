import { network } from 'connectors';
import { parseHex, toBN } from '../../utils';
import { supportedNetworksConfigByEnv, chainNames, graphEndpoints } from '../../connectors';
import { Pair, Route, Token, TokenAmount, WETH } from '@uniswap/sdk';
import Contract from 'web3-eth-contract';
import Web3 from 'web3';

// @TODO: use caching
const getWebProvider = () => new Web3(window.ethereum);

let contracts = {
    [chainNames.Ethereum]: {},
    [chainNames.Matic]: {}
};

export const toTokenAmount = (amount, decimals) => {
  if(amount === "N/A") return toBN("0");
  return toBN(amount, decimals);
};

let diff;
const MAX_TIME = 0;
let lastBlockFetch = 0;
let cachedBlock;

const localTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export async function getNow(forceSync = true) {
  if (forceSync || !diff) {
    let timestamp = parseInt((await getBlockCached(getWebProvider().eth.getBlock)).timestamp);
    diff = timestamp - localTimestamp();
    return timestamp;
  }
  return localTimestamp() + diff;
}

async function getBlockCached(getBlock) {
  if (!cachedBlock || new Date().getTime() > lastBlockFetch + MAX_TIME) {
    cachedBlock = await getBlock("latest");
    lastBlockFetch = new Date().getTime();
  }
  return cachedBlock;
}

export function getWeb3Contract(contractName, chainName) {
    if (contracts[chainName][contractName] === undefined) {
        const contractsJSON = require(`../files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${chainName}.json`);
        if (contractsJSON[contractName]) contracts[chainName][contractName] = new Contract(contractsJSON[contractName].abi, contractsJSON[contractName].address);
        else return undefined;
    }
    return contracts[chainName][contractName];
}

export function getUNIV2Contract(address, chainName) {
  const contractsJSON = require(`../files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${chainName}.json`);
  return new Contract(contractsJSON["UNIV2"].abi, address);
}

export async function getERC20Contract(address) {
  try {
    const chainName = await getChainName();
    const contractsJSON = require(`../files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${chainName}.json`);
    if(!contractsJSON) return;
    return new Contract(contractsJSON["ERC20"].abi, address);
  } catch(error) {
    console.log(error);
  }
}


export const getGraphEndpoint = async () => {
    try {
        const chainId = await getChainId();
        return graphEndpoints[process.env.REACT_APP_ENVIRONMENT][chainId];
    } catch(error) {
        console.log(error);
    }
}

const devPrices = { "USDT-WETH": 1080, "GOVI-WETH": 0.0002, "GOVI-USDT": 0.216, "COTI/ETH-USDT": 0.03 };
const SIGNIFICANT_DIGITS = 10;

function getConnectorToken(chainId) {
    if (chainId === 80001 || chainId === 31339) {
      return { address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", symbol: "WMATIC", decimals: 18 };
    } else if (chainId === 137 || chainId === 31338) {
      return { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", symbol: "WETH", decimals: 18 };
    }
    return { address: getConnectorTokenAddress(chainId), symbol: "WETH", decimals: 18 };
}

function getConnectorTokenAddress(chainId) {
    if (chainId === 1337) {
      return "0xcF97dacDe084852D111D433e2F86900585dE250c"; // local
    } else if (chainId === 31337) {
      return WETH[1].address; // local
    } else return WETH[chainId].address;
  }

export async function getChainId() {
    const networkChainId = await network.getChainId();
    return networkChainId ? parseHex(networkChainId) : window.ethereum.chainId;
}

export const getChainName = async () => {
    try {
        const chainId = await getChainId();
        return supportedNetworksConfigByEnv[chainId]?.chainName;
    } catch(error) {
        console.log(error);
    }
}

export async function getPrice(token1, token2) {
    const chainId = await getChainId();
 
   if (token1.address === token2.address) return 1;
   // hardcoded prices for local/dev networks (hopefully temporary)
   if ([1337].includes(chainId)) {
     let pairSymbols = token1.symbol + "-" + token2.symbol;
     console.log(`pairSymbols: ${pairSymbols}`);
     return devPrices[pairSymbols];
   }
   const srcToken = new Token(chainId, token1.address, token1.decimals, token1.symbol);
   const dstToken =  new Token(chainId, token2.address, token2.decimals, token2.symbol);
 
   let pairs;
   try {
     const pair = await fetchPairData(srcToken, dstToken, supportedNetworksConfigByEnv[chainId].chainName);
     pairs = [pair];
   } catch (error) {
     const cToken = getConnectorToken(chainId);
     const connectorToken = new Token(chainId, cToken.address, cToken.decimals, cToken.symbol);
     const pair1 = await fetchPairData(srcToken, connectorToken, supportedNetworksConfigByEnv[chainId].chainName);
     const pair2 = await fetchPairData(connectorToken, dstToken, supportedNetworksConfigByEnv[chainId].chainName);
     pairs = [pair1, pair2];
   }
   const route = new Route(pairs, srcToken, dstToken);
   return route.midPrice.toSignificant(SIGNIFICANT_DIGITS);
 }
 
 async function fetchPairData(t0, t1, chainName) {
   const factory = getWeb3Contract("UniswapV2Factory", chainName);
   const pairAddress = await factory.methods.getPair(t0.address, t1.address).call();
   const reserves = await getUNIV2Contract(pairAddress, chainName).methods.getReserves().call();
   const firstToken = await getUNIV2Contract(pairAddress, chainName).methods.token0().call();
   // const secondToken = await getUNIV2Contract(pairAddress).methods.token1().call();
   let swapped = firstToken.toLowerCase() === t1.address.toLowerCase();
   let reserve0 = reserves[swapped ? "1" : "0"];
   let reserve1 = reserves[swapped ? "0" : "1"];
   const pair = new Pair(new TokenAmount(t0, reserve0), new TokenAmount(t1, reserve1));
   return pair;
 }

export async function convert(amount, fromToken, toToken) {
    const chainId = await getChainId();
    fromToken = fromToken || getConnectorToken(chainId);
    toToken = toToken || getConnectorToken(chainId);
    // console.log(`fromToken [${fromToken.symbol}] ${fromToken.address}`);
    // console.log(`toToken [${toToken.symbol}] ${toToken.address}`);
    const price = await getPrice(fromToken, toToken);
    const multipliedPrice = toBN(10).pow(toBN(toToken.decimals)) * price;
    return toBN(multipliedPrice.toFixed(0))
      .mul(toBN(amount))
      .div(toBN(10).pow(toBN(fromToken.decimals)));
}


export async function getBalance(address, tokenAddress = undefined) {
  try {
    if (tokenAddress) return (await getERC20Contract(tokenAddress)).methods.balanceOf(address).call();
    else return await getWebProvider().eth.getBalance(address);
  } catch(error) {
    console.log(error);
  }
}

export const aprToAPY = (apr, period = 365 * 24 * 60) => {
  const blocksPerMin = period === 365 ? 1 : 4;
  const n = period * blocksPerMin;
  const apy = ((1 + apr / 100 / n) ** n - 1) * 100;
  return apy === Infinity || apy > 1000000 ? 1000000 : apy;
};

export async function fromLPTokens(platform, lpTokenAmount) {
  let totalSupply = toBN(await platform.methods.totalSupply().call());
  let totalBalance = toBN(await platform.methods.totalBalanceWithAddendum().call());
  return totalSupply.isZero() ? toBN(0)  : lpTokenAmount.mul(totalBalance).div(totalSupply);
}

export const getPositionRewardsContract = async (token) => { 
  try {
    const chainName = await getChainName();
    const contractsJSON = require(`../files/${process.env.REACT_APP_ENVIRONMENT}/Contracts_${chainName}.json`);
    if(!contractsJSON) return;

    const HELPER_ADDRESS = "0xd5A222B80788E36F707adDc74c3Cb5de7e43F1B0";
    const HELPER_V2_ADDRESS = "0x1C746415D73D4cBc995E5eB80dDD07E698a32C8c";
    const [address, abi] = token.key === "eth" ? [HELPER_V2_ADDRESS, contractsJSON["PositionRewardsV2"].abi] : [HELPER_ADDRESS, contractsJSON["PositionRewards"].abi];
    return new Contract(abi, address)
  } catch(error) {
    console.log(error);
  }
}

export const getCviValue = async (cviOracle) => {
  try {
    const { cviValue } = await cviOracle.methods.getCVILatestRoundData().call();
    return cviValue;
  } catch(error) {
    console.log(error);
    return "N/A";
  }
}