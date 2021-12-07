import { appViewContext } from 'components/Context';
import Button from 'components/Elements/Button';
import { useActiveToken } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import arbitrageConfig, { activeTabs as arbitrageActiveTabs } from 'config/arbitrageConfig';
import config from 'config/config';
import { upperFirst } from 'lodash';
import { useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import { useActionController } from './ActionController';

const requestActionByType = {
    [arbitrageActiveTabs.mint]: "fulfillMint",
    [arbitrageActiveTabs.burn]: "fulfillBurn",
}

const PendingRequest = () => {
    const dispatch = useDispatch();
    const {account} = useActiveWeb3React();
    const { w3 } = useContext(appViewContext);
    const { unfulfilledRequests } = useSelector(({wallet})=>wallet);
    const { action, isOpen, setIsOpen, disabled, amount, type, requestData} = useActionController(); 
    const activeToken = useActiveToken();
    const [isProcessing, setIsProcessing] = useState();
    const originalRequest = unfulfilledRequests.find(r => r.requestId === requestData.requestId);

    const checkUserBalance = useCallback(async () => {
      try {
        const accountBalance = await w3?.tokens[activeToken.pairToken.rel.contractKey].balanceOf(account); 
        if(requestData.tokenAmountToFulfill.gt(accountBalance)) {
          dispatch(addAlert({
            id: action,
            eventName: `${upperFirst(action)} - failed`,
            alertType: config.alerts.types.FAILED,
            message: "Cannot fulfill due to insufficient wallet balance."
          }));
          return;
        }
        return true;
      } catch(error) {
        console.log(error);
        return;
      }
    }, [account, action, activeToken.pairToken.rel.contractKey, dispatch, requestData.tokenAmountToFulfill, w3?.tokens])

    const onLiquidate = useCallback(async() => {
        try {
          setIsProcessing(true);
          await w3?.tokens[activeToken.rel.volTokenKey].refresh();
          await w3?.tokens[activeToken.rel.volTokenKey][requestActionByType[action]](originalRequest.requestId, { account });
          dispatch(addAlert({
            id: action,
            eventName: `${upperFirst(action)} - success`,
            alertType: config.alerts.types.CONFIRMED,
            message: "Transaction success!"
          }));
        } catch (error){
          console.log("fulfill mint error: ", error);
          dispatch(addAlert({
            id: action,
            eventName: `${upperFirst(action)} - failed`,
            alertType: config.alerts.types.FAILED,
            message: "Transaction failed!"
          }));
        } finally {
          setIsProcessing(false);
        }
      }, [account, action, activeToken.rel.volTokenKey, dispatch, originalRequest.requestId, w3?.tokens]);

    const onClick = async () => {
        if(type === arbitrageConfig.actionsConfig.fulfill.key) {
            const hasEnoughBalance = await checkUserBalance();
            if(!hasEnoughBalance) return;
            if(!isOpen) return setIsOpen(true);
            return;
        }

        // type === liquidte
        onLiquidate();
    }

    return <div className={`pending-request-component ${type}`}>
        <div className="pending-request-component__container">
            <Button 
                className="pending-request-component__container--button" 
                buttonText={upperFirst(type)}
                onClick={onClick}
                processingText={amount > 0  && "Calculating"}
                processing={isProcessing}
                disabled={disabled}
            />
        </div>
    </div>
     
}

export default PendingRequest;