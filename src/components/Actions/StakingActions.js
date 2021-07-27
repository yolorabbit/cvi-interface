import CountdownComponent, { useIsLockedTime } from "components/Countdown/Countdown";
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
import { actionConfirmEvent, gas, toBN, toBNAmount } from "utils";
import { useActionController } from "./ActionController";

const StakingActions = () => {
    const {disabled, type, token: tokenName, isModal, isOpen, setIsOpen, amount, setAmount, protocol } = useActionController();
    const dispatch = useDispatch();
    const contracts = useContext(contractsContext);
    const { account } = useActiveWeb3React();
    const approvalValidation = useApproveToken();
    const lockedTime = useIsLockedTime(type === stakingConfig.actionsConfig.unstake.key && tokenName === "govi");
    const { selectedNetwork } = useSelector(({app})=>app);
    const token = stakingConfig.tokens[selectedNetwork][protocol][tokenName]
    const [processing, setProcessing] = useState(false);
    const unstakeModalButtonDisabled = (isOpen && !isModal && disabled);
    const unstakeTableButtonDisabled = (token.key === 'govi' && (lockedTime > 0 || lockedTime === null));
    
    const onClick = async () => {
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

            switch (type) {
                case "stake":
                    await contracts[token.rel.stakingRewards].methods.stake(toBN(toBNAmount(amount, token.decimals))).send({from: account, ...gas});
                    break;
                case "unstake":
                    const action = token.key === 'govi' ? "unstake" : "withdraw";
                    await contracts[token.rel.stakingRewards].methods[action](toBN(toBNAmount(amount, token.decimals))).send({from: account, ...gas});        
                    break;    
                default:
                    break;
            }
            dispatch(addAlert({
                id: type,
                eventName: `${upperFirst(type)} ${token.label?.toUpperCase()} - success`,
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));

            actionConfirmEvent(dispatch);

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
        }
    }

    const renderView = () => {
        switch(type) {
            case stakingConfig.actionsConfig.unstake.key:
                return <div className="unstake-component">
                <div className="unstake-component__container">
                    {(!isOpen && isModal) && <CountdownComponent lockedTime={lockedTime} /> }
                    <Button 
                        className="unstake-component__container--button" 
                        buttonText="Unstake" 
                        onClick={onClick}
                        disabled={unstakeModalButtonDisabled || unstakeTableButtonDisabled}
                        processing={processing}
                    />
                    {!isModal && isOpen && <span className="pay-attention">
                     * Pay Attention: After unstaking your LP tokens, you won't be able to withdraw your liquidity for up to 72 hours.
                    </span>}
                </div>
            </div>

            case stakingConfig.actionsConfig.stake.key:
                return  <div className="stake-component">
                    <div className="stake-component__container">
                        {(!isOpen && isModal) && <CountdownComponent lockedTime={lockedTime} /> }
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