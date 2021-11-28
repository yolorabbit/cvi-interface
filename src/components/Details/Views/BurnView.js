import { useMemo} from "react";
import Stat from "components/Stat";
import { useActiveToken } from "components/Hooks";
import config from "config/config";

const BurnView = ({amount, selectedCurrency }) => {
    const activeToken = useActiveToken(selectedCurrency, config.routes.arbitrage.path);

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
                value={"0"} 
                _suffix={tokenName} 
            />
            
            <Stat 
                title="Time to fulfillment" 
                value={"00:00 HH:MM"} 
            />

            <Stat 
                className="bold green"
                title="Estimated number of tokens" 
                value={"0"} 
                _suffix={tokenName}
            />
        </>
    }, [activeToken?.name, amount]) 
}

export default BurnView;