import Button from 'components/Elements/Button';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { actionConfirmEvent, commaFormatted, toBN, toBNAmount, toDisplayAmount } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from 'config/config';
import { appViewContext } from 'components/Context';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import ErrorModal from 'components/Modals/ErrorModal';
import { upperCase } from 'lodash';

const SubmitMint = () => {
    const dispatch = useDispatch();
    const isActiveInDOM = useInDOM();
    const { account } = useActiveWeb3React();
    const { w3 } = useContext(appViewContext);
    const { type, disabled, setIsOpen, amount, setAmount, delayFee, cb: updateAvailableBalance } = useActionController();
    const activeToken = useActiveToken(type);
    const [isProcessing, setProcessing] = useState();
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const [errorMessage, setErrorMessage] = useState();

    const onClick = useCallback(async () => {
        setProcessing(true);

        try {
            await w3?.tokens[activeToken.rel.volTokenKey].refresh();
            const totalRequestsAmount = w3?.tokens[activeToken.rel.volTokenKey].totalRequestsAmount;
            const availableToOpen = w3?.tokens[activeToken.rel.volTokenKey].maxSubmitMintAmount();
            const maxAvailableToOpen = availableToOpen < 0 ? totalRequestsAmount : totalRequestsAmount.add(availableToOpen);
            const availableBalanceWithTokenAmount = totalRequestsAmount.add(tokenAmount);

            if(availableToOpen < 0) {
                return setErrorMessage(`The total pending mint requests amount can not exceed ${commaFormatted(toDisplayAmount(maxAvailableToOpen, activeToken.decimals))} ${upperCase(activeToken.name)} Please try again later`);
            } else if(availableBalanceWithTokenAmount.gt(maxAvailableToOpen)) {
                const amountToSelect = tokenAmount.sub(toBN(availableBalanceWithTokenAmount.sub(maxAvailableToOpen)));
                return setErrorMessage(`
                    The total pending mint requests amount can not exceed 
                    ${commaFormatted(toDisplayAmount(maxAvailableToOpen, activeToken.decimals))} ${upperCase(activeToken.name)} 
                    Please select an amount lower than ${commaFormatted(toDisplayAmount(amountToSelect, activeToken.decimals))} ${upperCase(activeToken.name)} 
                    or try again later`
                );
            }

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet."
            }));

            await w3?.tokens[activeToken.rel.volTokenKey].submitMint(tokenAmount, {
                delay: delayFee.delayTime,
                account 
            });

            dispatch(addAlert({
                id: 'mint',
                eventName: "Mint request - success",
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));

            actionConfirmEvent(dispatch);
        } catch (error) {
            console.log(error);
        
            dispatch(addAlert({
                id: 'mint',
                eventName: "Mint - failed",
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
        } finally {
            if(isActiveInDOM()) {
                setProcessing(false);
                setAmount("");
                setIsOpen(false);
                if(updateAvailableBalance) {
                    updateAvailableBalance();
                }
            }
        }
    }, [account, activeToken.decimals, activeToken.name, activeToken.rel.volTokenKey, delayFee.delayTime, dispatch, isActiveInDOM, setAmount, setIsOpen, tokenAmount, updateAvailableBalance, w3?.tokens])

    return useMemo(() => {
        return  (
            <div className="mint-component">
                {errorMessage && <ErrorModal error={errorMessage} setModalIsOpen={() => setErrorMessage(false)} /> }

                <Button 
                    className="button" 
                    buttonText="SUBMIT"
                    onClick={onClick}
                    disabled={disabled || delayFee === 'N/A' || !amount || amount === "0" || delayFee?.fee === null}
                    processing={isProcessing || delayFee?.fee === null || amount === null}
                    processingText={!isProcessing && "Calculating"}
                />
            </div>
        )
    }, [amount, delayFee, disabled, errorMessage, isProcessing, onClick])
}

export default SubmitMint;