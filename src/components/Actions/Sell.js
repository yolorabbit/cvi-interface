import Button from 'components/Elements/Button';
import { useMemo, useState } from 'react';
import { useActiveToken, useInDOM } from 'components/Hooks';
import { useActionController } from './ActionController';
import { useContext } from 'react';
import { contractsContext } from '../../contracts/ContractContext';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { gas, toBN, toBNAmount } from '../../utils/index';
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import config from '../../config/config';
import Countdown from 'components/Countdown/Countdown';
import SellInfo from 'components/pages/Platform/Info/SellInfo';
import { getPositionValue, MAX_CVI_VALUE } from 'contracts/apis/position';
import useCountdown from 'components/Countdown/Countdown';

const Sell = () => {
    const dispatch = useDispatch(); 
    const isActiveInDOM = useInDOM();
    const { isOpen, setIsOpen, isModal, disabled, token, amount, setAmount, updateAvailableBalance } = useActionController();
    const { account } = useActiveWeb3React();
    const contracts = useContext(contractsContext);
    const activeToken = useActiveToken(token);
    const [isProcessing, setProcessing] = useState();
    const tokenAmount = useMemo(() => toBN(toBNAmount(amount, activeToken.decimals)), [amount, activeToken.decimals]);
    const [lockedTime, CountdownComponent] = useCountdown();
    const Countdown = useMemo(
        () => () => CountdownComponent, 
        //eslint-disable-next-line
    [lockedTime]);
    
    const sell = async () => {
        try {
            let positionValue;
            try {
                positionValue = await getPositionValue();
            } catch(error) {
                console.log(error);
                return;
            }

            const { getCVILatestRoundData } = contracts[activeToken.rel.cviOracle].methods;
            const { cviValue } = await getCVILatestRoundData().call();
            let positionUnitsAmount = false;
            if(!toBN(toBNAmount(positionValue.currentPositionBalance, activeToken.decimals)).cmp(tokenAmount)) {
                positionUnitsAmount = toBN(positionValue.positionUnitsAmount);
            };
    
            const _amount = !positionUnitsAmount ? toBN(toBNAmount(amount, activeToken.decimals)).mul(toBN(MAX_CVI_VALUE)).div(toBN(cviValue)) : toBN(positionUnitsAmount);
            await contracts[activeToken.rel.platform].methods.closePosition(_amount, toBN('1')).send({from: account, ...gas});

            dispatch(addAlert({
                id: 'closePositionSuccess',
                eventName: "Sell position - success",
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));
        } catch(error) {
            console.log(error);
            dispatch(addAlert({
                id: 'closePositionFailed',
                eventName: "Sell position - failed",
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
        }
    }

    const onClick = async () => {
        if(!isOpen) return setIsOpen(true);
        setProcessing(true);
        // TODO: check isLocked and HasGoviToClaim
        
        try {
            dispatch(addAlert({
                id: 'notice',
                alertType: config.alerts.types.NOTICE,
                message: "Please confirm the transaction in your wallet"
            }));

            await sell();
        } catch (error) {
          console.log(error);
            dispatch(addAlert({
                id: 'closePositionFailed',
                eventName: "Sell position - failed",
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed!"
            }));
        } finally {
            if(isActiveInDOM()) {
                setProcessing(false);
                setAmount("");
                updateAvailableBalance();
            }
        }
    }

    return (
        <> 
            <div className="sell-component">
                <div className="sell-component__container">
                    {(isOpen && !isModal) && <SellInfo />}
                    <Countdown />
                    <Button 
                        className="sell-component__container--button" 
                        buttonText="Sell" 
                        onClick={onClick}
                        processing={isProcessing}
                        disabled={(isOpen && disabled) || (!isOpen && lockedTime >= 0)}
                    />
                </div>
            </div>
        </>
    )
}

export default Sell;