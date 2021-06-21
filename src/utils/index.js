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