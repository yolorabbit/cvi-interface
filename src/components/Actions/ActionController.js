import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';
import Slippage from 'components/Slippage';
import Expand from 'components/Expand';
import { appViewContext } from 'components/Context';
import Action from './Action';
import platformConfig from 'config/platformConfig';
import { useActiveToken } from '../Hooks';
import arbitrageConfig from 'config/arbitrageConfig';
import TimeToFullfill from 'components/pages/Arbitrage/TimeToFullfill';
import { activeTabs as arbitrageActiveTabs } from 'config/arbitrageConfig';
import Mint from 'components/Modals/ArbitrageModal/Views/Mint';
import Burn from 'components/Modals/ArbitrageModal/Views/Burn';

const actionControllerContext = createContext({});
export const ActionControllerContext = (props = {}) => {
  return (
    <actionControllerContext.Provider value={props}>
      <Action />
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const context = useContext(actionControllerContext);
  return context;
}

const ActionController = ({action, requestData, type, disabled, amountLabel = "Amount", token, leverage, delayFee, setDelayFee, amount, setAmount, slippageTolerance, setSlippageTolerance, isModal, view="platform", protocol, balances, cb}) => {
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [isOpen, setIsOpen] = useState();
  const { activeView } = useContext(appViewContext);
  
  const _activeToken = useActiveToken(token);
  const getActiveToken = useCallback( () => {
    if(arbitrageActiveTabs?.[activeView]) return activeView === arbitrageActiveTabs.mint ? _activeToken : _activeToken.pairToken;
    return _activeToken;
  }, [_activeToken, activeView]);

  const activeToken = getActiveToken();
  
  const renderActionComponent = useCallback((isModal = false) => {
    return <ActionControllerContext
        action={action}
        disabled={!(!disabled && !insufficientBalance)}
        type={type} 
        token={token} 
        protocol={protocol}
        leverage={leverage} 
        amount={amount} 
        setAmount={setAmount} 
        delayFee={delayFee}
        isOpen={isOpen} 
        isModal={isModal} 
        balances={balances} 
        setIsOpen={setIsOpen}
        slippageTolerance={slippageTolerance}
        cb={cb}
      />
  }, [action, disabled, insufficientBalance, type, token, protocol, leverage, amount, setAmount, delayFee, isOpen, balances, slippageTolerance, cb])

  useEffect(() => {
    if(action) return;
    if(!isOpen && amount !== "") {
      setAmount("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeView]);

  const getInnerModal = useCallback(() => {
    switch (action) {
      case arbitrageActiveTabs.mint: return <Mint closeBtn={() => setIsOpen(false)} requestData={requestData} />
      case arbitrageActiveTabs.burn: return <Burn closeBtn={() => setIsOpen(false)} requestData={requestData} />
    
      default: return (
        <InputAmount 
          label={amountLabel}
          symbol={token} 
          amount={amount} 
          setAmount={setAmount} 
          setInsufficientBalance={setInsufficientBalance}
          availableBalance={balances?.tokenAmount}
          view={view}
          protocol={protocol} 
          type={type}
        />
      )
    }
  }, [action, amount, amountLabel, balances?.tokenAmount, protocol, requestData, setAmount, token, type, view])

  return useMemo(() => <div className="action-controller_component">
    {(isModal && isOpen) && <Modal className={action ? "arbitrage-modal" : ""} clickOutsideDisabled closeIcon handleCloseModal={() => setIsOpen(false)}>
      {getInnerModal()}
      {(type === platformConfig.actionsConfig.sell.key) ? <AdvancedOptions
        slippageTolerance={slippageTolerance}
        setSlippageTolerance={setSlippageTolerance} /> : <br />}

      {!action && renderActionComponent()}
    </Modal>}

    {!isModal && <>
      <InputAmount
        label={amountLabel}
        symbol={token}
        amount={amount}
        setAmount={setAmount}
        setInsufficientBalance={setInsufficientBalance}
        availableBalance={balances?.tokenAmount}
        protocol={protocol}
        view={view}
        type={type} />

      {arbitrageConfig.actionsConfig[type] && <TimeToFullfill delayFee={delayFee} setDelayFee={setDelayFee} />}

      {activeToken?.name === 'usdc' && <AdvancedOptions
        slippageTolerance={slippageTolerance}
        setSlippageTolerance={setSlippageTolerance} />}
    </>}
    {renderActionComponent(isModal)}
  </div>, [isModal, isOpen, action, getInnerModal, type, slippageTolerance, setSlippageTolerance, renderActionComponent, amountLabel, token, amount, setAmount, balances?.tokenAmount, protocol, view, delayFee, setDelayFee, activeToken?.name])
};

const AdvancedOptions = ({slippageTolerance, setSlippageTolerance}) => {
  const { activeView } = useContext(appViewContext);
  if(activeView !== "trade") return null;
  return <Expand header="Advanced" classNames="advanced-expand" expandedView={<Slippage slippageTolerance={slippageTolerance} setSlippageTolerance={setSlippageTolerance} />} />
}

export default ActionController;
