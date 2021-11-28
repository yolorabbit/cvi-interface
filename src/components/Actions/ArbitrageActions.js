import { useActionController } from "./ActionController";
import { useMemo } from 'react';
import Mint from "./Mint";
import arbitrageConfig from "config/arbitrageConfig";
import Burn from "./Burn";

const ArbitrageActions = () => {
    const { type } = useActionController();

    return useMemo(() => {
        switch(type) {
            case arbitrageConfig.actionsConfig.burn.key: 
                return <Burn />
            default:
                return <Mint />
        }
    }, [type]);
}

export default ArbitrageActions;