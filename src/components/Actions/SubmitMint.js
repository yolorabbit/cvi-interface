import Button from 'components/Elements/Button';
import { useCallback, useMemo, useState } from 'react';
import { useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { actionConfirmEvent } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import ErrorModal from 'components/Modals/ErrorModal';

const SubmitMint = () => {
    const dispatch = useDispatch();
    const isActiveInDOM = useInDOM();
    const { disabled, setIsOpen, amount, setAmount, cb: updateAvailableBalance } = useActionController();
    const [modalIsOpen, setModalIsOpen] = useState();
    const [errorMessage] = useState();
    const [isProcessing, setProcessing] = useState();

    const toggleModal = async(flag) => {
        setModalIsOpen(flag);
    }

    const onClick = useCallback(async () => {
        setProcessing(true);

        try {

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet."
            }));

            await new Promise(resolve => setTimeout(() => {
                resolve(true)
            }, 1000));
                
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
                updateAvailableBalance();
                setIsOpen(false);
            }
        }
    }, [dispatch, isActiveInDOM, setAmount, setIsOpen, updateAvailableBalance])

    return useMemo(() => {
        return  (
            <> 
                {modalIsOpen && <ErrorModal error={errorMessage} setModalIsOpen={toggleModal} /> }
                <div className="mint-component">
                    <Button 
                        className="button" 
                        buttonText="SUBMIT"
                        onClick={onClick}
                        disabled={disabled}
                        processing={isProcessing}
                        processingText={amount > 0 && "Calculating"}
                    />
                </div>
            </>
        )
    }, [amount, disabled, errorMessage, isProcessing, modalIsOpen, onClick])
}

export default SubmitMint;