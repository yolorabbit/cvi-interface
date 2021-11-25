import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import arbitrageConfig from "config/arbitrageConfig";
import config from "config/config";
import platformConfig from "config/platformConfig";
import { chainNames, ConnectorNames, defaultChainId, supportedNetworksConfigByEnv } from "connectors";
import { getChainName } from "contracts/utils";
import moment from "moment";
import { actionConfirm } from "store/actions/events";

export const gas = config.isMainnet ? { } : { };

export const getTimeDurationFormatted = (lockedTime) => {
    const minutesDuration = moment.duration(lockedTime).asMinutes();
    const hours = parseInt(minutesDuration / 60);
    const minutes = parseInt(minutesDuration % 60);
    const timeDurationFormatted = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    return timeDurationFormatted;
};

const removeZerosFromEndOfNumber = (number) => {
    if(number.includes('.')){
        while (number.charAt(number.length -1) === "0")
        {
            number = number.substring(0,number.length -1);
        }
        
        if (number.charAt(number.length -1) === ".")
        number = number.substring(0,number.length -1);
    }
    return number;
}

export const commaFormatted = (amount) => {
    if(amount === "N/A" || amount === null || amount === undefined) return amount;
    amount = removeZerosFromEndOfNumber(amount.toString());
    var parts = amount.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const customFixed = (num, fixed) => {
    if(!fixed) return parseInt(num);
    num = String(num);
    fixed = fixed + 1;
    if (num.length < 3) return num
    let fixed_num = "";
    let counter = 0;
    for (let i = 0; i < num.length; i++) {
        fixed_num = fixed_num + num[i];
        if (num[i] === "." || counter > 0) {
            counter++
            if (counter === fixed) {
                return fixed_num
            }
        }
    }
    return fixed_num
}


export const toFixed = (x) => {
    var data= String(x).split(/[eE]/);
    if(data.length === 1) return data[0]; 
    var  z= '', sign= x<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;
    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';// eslint-disable-next-line
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while(mag--) z += '0';
    return str + z;
}

export const toDisplayAmount = (amount, magnitude = 0) => {
    if(amount === "N/A") return BigNumber("0");
    const mag = BigNumber(10).pow(BigNumber(magnitude));
    return BigNumber(amount).div(mag).toString();
}

export const toBNAmount = (amount, magnitude = 0) => {
    const mag = new BigNumber(10).pow(new BigNumber(magnitude));
    return toFixed(new BigNumber(isNaN(amount) ? "0" : amount).multipliedBy(mag).toString());
};

export const toBN = (amount, magnitude = 0) => {
    try {
        if(amount === "N/A") return new BN("0");
        const mag = new BN(10).pow(new BN(magnitude));
        if(amount === null) return new BN("0");
        return new BN(isNaN(amount) || !amount ? "0" : amount).mul(mag);
    } catch(error) {
        console.log(error);
        return new BN("0");
    }
};

export const fromBN = (amount, magnitude = 0) => {
    const wei = toBN(amount.toString());
    const base = toBN(10).pow(toBN(magnitude));
    let fraction = wei.abs().mod(base).toString(10);
    while (fraction.length !== Number(magnitude)) fraction = `0${fraction}`;
    const whole = wei.abs().div(base).toString(10);
    const unsigned = `${whole}.${fraction}`;
    return wei.isNeg() ? -unsigned : +unsigned;
};

export const parseHex = (hex) => {
    return parseInt(Number(hex), 10);
 }

 export const getCurrentProviderName = (currentProvider) => {
     if(currentProvider?.isMetaMask) {
         return ConnectorNames.MetaMask;
     }

     if(currentProvider?.isWalletConnect) {
         return ConnectorNames.WalletConnect;
     }

     return ConnectorNames.Network;
 }

export const chainNameToChainId = (_chainName) => {
    const network = Object.values(supportedNetworksConfigByEnv).find(({chainName}) => chainName === _chainName);
    if(!network) return defaultChainId;
    return parseHex(network.chainId);
 }

 export const customFixedTokenValue = (value, _toFixed, decimals) => {
     return toFixed(customFixed(toDisplayAmount(value, decimals), _toFixed))
 }

export const maxUint256 = toBN(2).pow(toBN(256)).sub(toBN(1));

export const actionConfirmEvent = async (dispatch) => {
    const chainName = await getChainName();

    if(chainName === chainNames.Matic) {
        dispatch(actionConfirm());
    }
}

export const arrayIsLoaded = (value) => value === "N/A" ? [] : value && value?.length > 0 ? value : [];


export const activeVolsSet = (selectedNetwork, path = "/platform") => {
    if(!selectedNetwork) return {};
    const getConfig = () => {
        switch(path) {
            case config.routes.arbitrage.path:
                return arbitrageConfig;
            default:
                return platformConfig;
        }
    }
    const _config = getConfig();
    const tokens = _config.tokens[selectedNetwork];
    const tokensKeys = Object.keys(tokens);
    const activeVolsObject = tokensKeys
        .filter(tokenKey => tokens[tokenKey].oracleId && !tokens[tokenKey].soon)
        .reduce((prev, current) => ({...prev, [tokens[current].oracleId]: tokens[current].oracleId}), {});

    return activeVolsObject;
}