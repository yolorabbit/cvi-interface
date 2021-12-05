import Button from 'components/Elements/Button';
import { upperFirst } from 'lodash';
import { useActionController } from './ActionController';

const PendingRequest = () => {
    const { isOpen, setIsOpen, disabled, amount, type } = useActionController(); 

    const onClick = () => {
        if(!isOpen) return setIsOpen(true);
    }

    return <div className={`pending-request-component ${type}`}>
        <div className="pending-request-component__container">
            <Button 
                className="pending-request-component__container--button" 
                buttonText={upperFirst(type)}
                onClick={onClick}
                processingText={amount > 0  && "Calculating"}
                disabled={disabled}
            />
        </div>
    </div>
     
}

export default PendingRequest;