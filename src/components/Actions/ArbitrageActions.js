import { useActionController } from "./ActionController";
import { useMemo } from 'react';
import arbitrageConfig from "config/arbitrageConfig";
import SubmitBurn from "./SubmitBurn";
import SubmitMint from "./SubmitMint";
import Fulfill from "./Fulfill";

const ArbitrageActions = () => {
    const { type } = useActionController();

    return useMemo(() => {
        switch(type) {
            case arbitrageConfig.actionsConfig.burn.key: 
                return <SubmitBurn />
            case arbitrageConfig.actionsConfig.fulfill.key:
                return <Fulfill />
            default:
                return <SubmitMint />
        }
    }, [type]);
}

export default ArbitrageActions;