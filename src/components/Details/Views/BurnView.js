import { useMemo} from "react";
import Stat from "components/Stat";
import { useActiveToken, useActiveVolInfo } from "components/Hooks";
import config from "config/config";

const BurnView = ({amount, selectedCurrency, activeVolIndex }) => {
    const activeVolInfo = useActiveVolInfo(activeVolIndex);
    const activeToken = useActiveToken(selectedCurrency, config.routes.arbitrage.path);
 
    return useMemo(() => {
        const tokenName = activeToken?.name?.toUpperCase();
       
        return  (
            <> 
                <Stat 
                    className="bold amount"
                    title="Burn amount" 
                    value={!amount ? "0" : amount} 
                    _suffix={tokenName} 
                />

                <Stat 
                    className="low-priority large-value"
                    title={`${activeVolIndex?.toUpperCase()} index`} 
                    value={activeVolInfo?.index} 
                />
            </>
        )
    }, [activeToken?.name, amount, activeVolIndex, activeVolInfo?.index]) 
}

export default BurnView;