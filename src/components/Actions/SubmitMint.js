import Button from 'components/Elements/Button';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { actionConfirmEvent } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from 'config/config';
import { appViewContext } from 'components/Context';
import { useActiveWeb3React } from 'components/Hooks/wallet';

const SubmitMint = () => {
    const activeToken = useActiveToken();
    const { account } = useActiveWeb3React();
    const dispatch = useDispatch();
    const isActiveInDOM = useInDOM();
    const { disabled, setIsOpen, amount, tokenAmount, setAmount, delayFee } = useActionController();
    const [isProcessing, setProcessing] = useState();
    const { w3 } = useContext(appViewContext);
    
    const onClick = useCallback(async () => {
        setProcessing(true);

        try {

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet."
            }));
            
            const submitMintRes = await w3?.tokens[activeToken.rel.contractKey].submitMint(tokenAmount, account, delayFee);
            console.log("submitMintRes: ", submitMintRes);

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
            }
        }
    }, [account, activeToken.rel.contractKey, delayFee, dispatch, isActiveInDOM, setAmount, setIsOpen, tokenAmount, w3?.tokens])

    return useMemo(() => {
        return  (
            <> 
                <div className="mint-component">
                    <Button 
                        className="button" 
                        buttonText="SUBMIT"
                        onClick={onClick}
                        disabled={disabled || delayFee === 'N/A'}
                        processing={isProcessing || delayFee === null || amount === null}
                        processingText={(amount > 0 || delayFee === null) && "Calculating"}
                    />
                </div>
            </>
        )
    }, [amount, delayFee, disabled, isProcessing, onClick])
}

export default SubmitMint;