import Button from 'components/Elements/Button';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { actionConfirmEvent, toBN, toBNAmount } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { appViewContext } from 'components/Context';

const SubmitBurn = () => {
    const dispatch = useDispatch();
    const isActiveInDOM = useInDOM();
    const { account } = useActiveWeb3React();
    const { w3 } = useContext(appViewContext);
    const { type, disabled, setIsOpen, amount, setAmount, delayFee, cb: updateAvailableBalance } = useActionController();
    const activeToken = useActiveToken(type);
    const [isProcessing, setProcessing] = useState();
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);

    const onClick = useCallback(async () => {
        setProcessing(true);

        try {
            await w3?.tokens[activeToken.rel.volTokenKey].refresh();
            
            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet."
            }));

            await w3?.tokens[activeToken.rel.volTokenKey].submitBurn(tokenAmount, {
                delay: delayFee.delayTime,
                account 
            });
                
            dispatch(addAlert({
                id: 'Burn',
                eventName: "Burn request - success",
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));

            actionConfirmEvent(dispatch);
        } catch (error) {
            console.log(error);
        
            dispatch(addAlert({
                id: 'Burn',
                eventName: "Burn - failed",
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
    }, [account, activeToken.rel.volTokenKey, delayFee?.delayTime, dispatch, isActiveInDOM, setAmount, setIsOpen, tokenAmount, updateAvailableBalance, w3?.tokens])

    return useMemo(() => {
        return  (
            <div className="burn-component">
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
    }, [amount, delayFee, disabled, isProcessing, onClick])
}

export default SubmitBurn;