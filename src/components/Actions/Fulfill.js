import Button from 'components/Elements/Button';
import { useActionController } from './ActionController';
import CountdownComponent, { useIsLockedTime } from 'components/Countdown/Countdown';


const Fulfill = () => {
    const { isOpen, setIsOpen, isModal, disabled, amount } = useActionController(); 
    const lockedTime = useIsLockedTime();

    const onClick = () => {
        if(!isOpen) return setIsOpen(true);
    }

    return <div className="fulfill-component">
        <div className="fulfill-component__container">
            {(!isOpen && isModal) && <CountdownComponent lockedTime={lockedTime} /> }
            <Button 
                className="fulfill-component__container--button" 
                buttonText="Fulfill" 
                onClick={onClick}
                processingText={amount > 0  && "Calculating"}
                disabled={disabled}
            />
        </div>
    </div>
     
}

export default Fulfill;