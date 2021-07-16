import Button from "components/Elements/Button";
import useApproveToken from "components/Hooks/useApproveToken";
import { useActiveWeb3React } from "components/Hooks/wallet";
import config from "config/config";
import stakingConfig from "config/stakingConfig";
import { contractsContext } from "contracts/ContractContext";
import { upperFirst } from "lodash";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "store/actions";
import { gas, toBN, toBNAmount } from "utils";
import { useActionController } from "./ActionController";

const StakingActions = () => {
    const {disabled, type, token: tokenName, isModal, isOpen, setIsOpen, amount, setAmount, protocol, cb } = useActionController();
    const dispatch = useDispatch();
    const contracts = useContext(contractsContext);
    const { account } = useActiveWeb3React();
    const approvalValidation = useApproveToken()
    const { selectedNetwork } = useSelector(({app})=>app);
    const token = stakingConfig.tokens[selectedNetwork][protocol][tokenName]
    const [processing, setProcessing] = useState(false);
    
    const onClick = async () => {
        if(disabled) return;
        if(isModal && !isOpen) return setIsOpen(true);
        setProcessing(true);
        const isApproved = await approvalValidation(token, amount);
        if(!isApproved) return;

        try {
            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));
            let response;
            switch (type) {
                case "stake":
                    response = await contracts[token.rel.stakingRewards].methods.stake(toBN(toBNAmount(amount, token.decimals))).send({from: account, ...gas});
                    break;
                case "unstake":
                    const action = token.key === 'govi' ? "unstake" : "withdraw";
                    response = await contracts[token.rel.stakingRewards].methods[action](toBN(toBNAmount(amount, token.decimals))).send({from: account, ...gas});        
                    break;    
                default:
                    break;
            }
            console.log("response: ", response);
            dispatch(addAlert({
                id: type,
                eventName: `${upperFirst(type)} ${token.label?.toUpperCase()} - success`,
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));

        }catch (error) {
            console.log(error);
            dispatch(addAlert({
                id: type,
                eventName: `${upperFirst(type)} ${token.label?.toUpperCase()} - failed`,
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
        } finally {
            setAmount("0");
            setIsOpen(false);
            setProcessing(false);
            cb();
        }
    }

    const renderView = () => {
        switch(type) {
            case stakingConfig.actionsConfig.unstake.key:
                return <div className="unstake-component">
                <div className="unstake-component__container">
                    <Button 
                        className="unstake-component__container--button" 
                        buttonText="Unstake" 
                        onClick={onClick}
                        processing={processing}
                        disabled={disabled}
                    />
                    {!isModal && isOpen && <span className="pay-attention">
                     * Pay Attention: After unstaking your LP tokens, you won't be able to withdraw your liquidity for up to 72 hours.
                    </span>}
                </div>
            </div>

            case stakingConfig.actionsConfig.stake.key:
                return  <div className="stake-component">
                    <div className="stake-component__container">
                        <Button 
                            className="stake-component__container--button"
                            buttonText="Stake" 
                            onClick={onClick}
                            disabled={disabled}
                            processing={processing}
                        />
                    </div>
                </div>

            default:
                return null;
        }
    }

    return renderView();
}

export default StakingActions;