import { useCallback, useContext, useEffect, useMemo, useState} from "react";
import Stat from "components/Stat";
import { useActiveToken } from "components/Hooks";
import { activeTabs as arbitrageActiveTabs } from "config/arbitrageConfig";
import { appViewContext } from "components/Context";
import debounce from "lodash.debounce";
import { getTimeDurationFormatted, toBN, toBNAmount, toDisplayAmount } from "utils";

const MintView = ({amount, delayFee}) => {
    const { w3 } = useContext(appViewContext);
    const activeToken = useActiveToken(arbitrageActiveTabs.mint);
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const [maxSubmitFees, setMaxSubmitFees] = useState("0");

    const loadData = useCallback(async () => {
        try {
            const maxFees = await w3.tokens[activeToken.rel.volTokenKey].maxSubmitFees(tokenAmount, delayFee.delayTime);
            setMaxSubmitFees(toDisplayAmount(maxFees, activeToken.decimals));
        } catch (error) {
            console.log(error);
            setMaxSubmitFees("N/A");
        } 
    }, [activeToken.decimals, activeToken.rel.volTokenKey, delayFee?.delayTime, tokenAmount, w3?.tokens]);

    const loadDataDebounce = useMemo(() => debounce(loadData, 500), [loadData]);
    
    useEffect(() => {
        if(!w3 || !delayFee?.delayTime || !tokenAmount || !w3?.tokens) return;
        if(!amount) return setMaxSubmitFees("0");
        
        setMaxSubmitFees(null);
        loadDataDebounce();

        return () => {
            loadDataDebounce.cancel();
        }
    }, [amount, delayFee?.delayTime, loadDataDebounce, tokenAmount, w3]);
    
    return useMemo(() => {
        const tokenName = activeToken?.name?.toUpperCase();
       
        return <> 
            <Stat 
                className="bold amount"
                title="Amount" 
                value={!amount ? "0" : amount} 
                _suffix={tokenName} 
            />

            <Stat 
                title="Up front payment" 
                value={maxSubmitFees === null ? null : maxSubmitFees}
                _suffix={tokenName} 
            />
            
            <Stat 
                title="Time to fulfillment" 
                value={
                    delayFee === "N/A" ? "N/A" 
                    : !delayFee?.delayTime ? null 
                    : `${getTimeDurationFormatted(60 * 60 * (delayFee?.delayTime / 3600) * 1000)} HH:MM`
                } 
            />

            <Stat 
                className="bold green no-padding"
                title="Estimated number of tokens" 
                value={"0"} 
                _suffix={tokenName}
            />
        </>
    }, [activeToken?.name, amount, delayFee, maxSubmitFees]) 
}

export default MintView;