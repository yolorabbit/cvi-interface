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