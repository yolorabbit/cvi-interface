import BigNumber from "bignumber.js";
import { BN } from "bn.js";

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
    return Number(fixed_num)
}

const DECIMALS = 6;


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

export function fromTokenAmountToUnits(tokenAmount, index) {
    return tokenAmount.mul(toBN(20000)).div(toBN(index));
}

export const toDisplayAmount = (amount, magnitude = 0) => {
    const mag = BigNumber(10).pow(BigNumber(magnitude));
    return BigNumber(amount).div(mag).toString();
}

export const toBNAmount = (amount, magnitude = 0) => {
    const mag = new BigNumber(10).pow(new BigNumber(magnitude));
    return toFixed(new BigNumber(isNaN(amount) ? "0" : amount).multipliedBy(mag).toString());
};

export const toBN = (amount, magnitude = 0) => {
    const mag = new BN(10).pow(new BN(magnitude));
    if(amount === null) return new BN("0");
    return new BN(isNaN(amount) || !amount ? "0" : amount).mul(mag);
};

export const toTokenAmount = amount => {
    return toBN(amount, DECIMALS);
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