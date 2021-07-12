import Button from "components/Elements/Button";
import platformConfig from "config/platformConfig";
import { useActionController } from "./ActionController";
import Buy from "./Buy";
import Deposit from './Deposit';
import Sell from "./Sell";
import Withdraw from "./Withdraw";
import { useMemo } from 'react';

const PlatformActions = () => {
    const { type } = useActionController();

    return useMemo(() => {
        switch(type) {
            case platformConfig.actionsConfig.sell.key:
                return <Sell />
                
            case platformConfig.actionsConfig.withdraw.key:
                return  <Withdraw />
    
            case platformConfig.actionsConfig.claim.key: {
                return  <div className="claim-component">
                    <b>100,587.01164174</b>
                    <span>&nbsp;GOVI (2,700 GOVI) </span>
                    <Button 
                        className="claim-button" 
                        buttonText="Claim" 
                        onClick={() => {}} 
                        disabled={false}
                        processing={false}
                    /> 
                </div>
            }
                
            case platformConfig.actionsConfig.deposit.key: {
                return <Deposit />
            }
            
            default:
                return <Buy />
        }
    }, [type]);
}

export default PlatformActions;