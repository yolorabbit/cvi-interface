import Button from 'components/Elements/Button';
import { useState } from 'react';
import { useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { actionConfirmEvent } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import CountdownComponent, { useIsLockedTime } from 'components/Countdown/Countdown';


const Fulfill = () => {
    const dispatch = useDispatch(); 
    const isActiveInDOM = useInDOM();
    const { isOpen, setIsOpen, isModal, disabled, amount, setAmount } = useActionController(); 
    const [isProcessing, setProcessing] = useState();
    const lockedTime = useIsLockedTime();

    const onClick = async () => {
        if(!isOpen) {
            return setIsOpen(true);
        }
        setProcessing(true);
        
        try {

            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));

            await new Promise(resolve => setTimeout(() => {
                resolve(true);
            }, 1000));

            if(isActiveInDOM()) {
                setIsOpen(false);
                setAmount("");
                actionConfirmEvent(dispatch);
            }

        } catch (error) {
            console.log(error);
            if(isActiveInDOM()) {
                setAmount("");
                setIsOpen(false);
            }
            
            dispatch(addAlert({
                id: 'fulfillment-failed',
                eventName: "Fulfillment - failed",
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
        } finally {
            if(isActiveInDOM()) {
                setProcessing(false);
            }
        }
    }

    return <div className="fulfill-component">
        <div className="fulfill-component__container">
            {(!isOpen && isModal) && <CountdownComponent lockedTime={lockedTime} /> }
            <Button 
                className="fulfill-component__container--button" 
                buttonText="Fulfill" 
                onClick={onClick}
                processing={isProcessing}
                processingText={amount > 0  && "Calculating"}
                disabled={disabled}
            />
        </div>
    </div>
     
}

export default Fulfill;