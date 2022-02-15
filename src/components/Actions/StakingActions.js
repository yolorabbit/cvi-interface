import { stakingViewContext } from "components/Context";
import CountdownComponent, { useIsLockedTime } from "components/Countdown/Countdown";
import Button from "components/Elements/Button";
import { useInDOM } from "components/Hooks";
import useApproveToken from "components/Hooks/useApproveToken";
import { useActiveWeb3React } from "components/Hooks/wallet";
import config from "config/config";
import stakingConfig from "config/stakingConfig";
import { contractsContext } from "contracts/ContractContext";
import { upperFirst } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "store/actions";
import { actionConfirmEvent, isGoviToken, isGoviV1Token, toBN, toBNAmount } from "utils";
import { useActionController } from "./ActionController";

const StakingActions = () => {
    const isActiveInDom = useInDOM();
    const { w3 } = useContext(stakingViewContext);
    const {disabled, type, token: tokenName, isModal, isOpen, setIsOpen, amount, setAmount, protocol, balances: { tokenAmount } = {} } = useActionController();
    const dispatch = useDispatch();
    const contracts = useContext(contractsContext);
    const { account } = useActiveWeb3React();
    const approvalValidation = useApproveToken();
    const [processing, setProcessing] = useState(false);
    const [lockup, setLockup] = useState(24);
    const lockedTime = useIsLockedTime(type === stakingConfig.actionsConfig.unstake.key && isGoviToken(tokenName));
    const { selectedNetwork } = useSelector(({app})=>app);
    const token = stakingConfig.tokens[selectedNetwork]?.[protocol]?.[tokenName];
    const unstakeModalButtonDisabled = ((isOpen && !isModal && (disabled || !(Number(amount ?? "0") > 0))));
    const isMaximumAmount = toBN(toBNAmount(amount, token.decimals)).eq(toBN(tokenAmount));
    const unstakeTableButtonDisabled = (!isOpen && (Number(tokenAmount ?? 0) <= 0)) || (isGoviToken(tokenName) && (lockedTime > 0 || lockedTime === null));
    const stakeModalDisabled = (isOpen && !isModal) && !(Number(amount ?? "0") > 0);
    const platfromName = stakingConfig.tokens[selectedNetwork].platform[tokenName]?.rel?.contractKey;
    
    useEffect(()=>{
        if(!contracts || !platfromName || !selectedNetwork || !tokenName) return
        const getLockup = async (cb) => {
            try{
                if(contracts[platfromName].methods.lpsLockupPeriod) {
                    const locktime = await contracts[platfromName].methods.lpsLockupPeriod().call();
                    if(isActiveInDom()) {
                        setLockup(locktime / 60 / 60)
                    }
                }
            } catch (error) {
                console.log("getLockuptime error: ", error);
            }
        }

        let canceled = false;

        getLockup((cb)=>{
            if(canceled) return
            cb()
        });

        return () => {
            canceled = true;
        }
    //eslint-disable-next-line
    },[tokenName, selectedNetwork, contracts]);

    const onClick = async () => {
        if(isModal && !isOpen) return setIsOpen(true);
        setProcessing(true);
        const isApproved = await approvalValidation(token, amount);
        if(!isApproved) return;
        
        try {
            const stakings = {...w3.stakings, ...w3.stakingRewards}

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));

            switch (type) {
                case "stake":
                    await stakings[token.rel.stakingRewards]["stake"](toBN(toBNAmount(amount, token.decimals)), account);
                    break;
                case "unstake":
                    if(isMaximumAmount) {
                        await stakings[token.rel.stakingRewards]["unstakeAll"](account);
                    } else {
                        await stakings[token.rel.stakingRewards]["unstake"](toBN(toBNAmount(amount, token.decimals)), account);
                    }

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
            if(isActiveInDom()) {
                setAmount("0");
                setIsOpen(false);
                setProcessing(false);
            } 
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
                        buttonText={isOpen && !isModal && isMaximumAmount && isGoviV1Token(token.key)? "Claim & Unstake" : "Unstake"} 
                        onClick={onClick}
                        disabled={unstakeModalButtonDisabled || unstakeTableButtonDisabled}
                        processing={processing}
                    />
                    {!isModal && isOpen && <span className="pay-attention">
                     * Pay Attention: After unstaking your LP tokens, you won't be able to withdraw your liquidity for up to {lockup} hours.
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
                            disabled={disabled || stakeModalDisabled}
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