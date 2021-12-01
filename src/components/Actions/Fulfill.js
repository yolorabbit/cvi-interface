import Button from 'components/Elements/Button';
import { useActionController } from './ActionController';

const Fulfill = () => {
    const { isOpen, setIsOpen, disabled, amount } = useActionController(); 

    const onClick = () => {
        if(!isOpen) return setIsOpen(true);
    }

    return <div className="fulfill-component">
        <div className="fulfill-component__container">
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