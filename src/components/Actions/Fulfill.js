import Button from 'components/Elements/Button';
import { useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { actionConfirmEvent, toBN, toBNAmount } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import CountdownComponent, { useIsLockedTime } from 'components/Countdown/Countdown';


const Fulfill = () => {
    const dispatch = useDispatch(); 
    const isActiveInDOM = useInDOM();
    const { isOpen, setIsOpen, isModal, disabled, token, amount, setAmount} = useActionController(); 
    const activeToken = useActiveToken(token);
    const [isProcessing, setProcessing] = useState();
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
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

    return <> 
        <div className="fulfill-component">
            <div className="fulfill-component__container">
                {(!isOpen && isModal) && <CountdownComponent lockedTime={lockedTime} /> }
                <Button 
                    className="fulfill-component__container--button" 
                    buttonText="Fulfill" 
                    onClick={onClick}
                    processing={isProcessing}
                    processingText={amount > 0  && "Calculating"}
                    disabled={(isOpen && (disabled || tokenAmount?.isZero())) || lockedTime > 0 || lockedTime === null}
                />
            </div>
        </div>
    </>
     
}

export default Fulfill;