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
import Mint from 'components/pages/Arbitrage/ArbitrageModal/Views/Mint';
import Burn from 'components/pages/Arbitrage/ArbitrageModal/Views/Burn';

const actionControllerContext = createContext({});
export const ActionControllerContext = ({action, disabled, token, protocol, type, leverage, amount, setAmount, slippageTolerance, isModal, isOpen, setIsOpen, balances, cb }) => {
  return (
    <actionControllerContext.Provider value={{action, disabled, type, token, protocol, leverage, amount, setAmount, isModal, slippageTolerance, isOpen, setIsOpen, balances, cb }}>
      <Action />
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const context = useContext(actionControllerContext);
  return context;
}

const ActionController = ({action, requestData, type, disabled, amountLabel = "Amount", token, leverage, amount, setAmount, slippageTolerance, setSlippageTolerance, isModal, view="platform", protocol, balances, cb}) => {
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
        isOpen={isOpen} 
        isModal={isModal} 
        balances={balances} 
        setIsOpen={setIsOpen}
        slippageTolerance={slippageTolerance}
        cb={cb}
      />
  }, [action, amount, balances, cb, disabled, insufficientBalance, isOpen, leverage, protocol, setAmount, token, type, slippageTolerance])

  useEffect(() => {
    if(action) return;
    if(!isOpen && amount !== "") {
      setAmount("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeView]);

  const getInnerModal = () => {
    switch (action) {
      case "mint": return <Mint closeBtn={() => setIsOpen(false)} requestData={requestData} />
      case "burn": return <Burn closeBtn={() => setIsOpen(false)} requestData={requestData} />
    
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
        />
      )
    }
  }

  return useMemo(() => {

    return <div className="action-controller_component">
        {(isModal && isOpen) && <Modal className={action ? "arbitrage-modal" : ""} clickOutsideDisabled closeIcon handleCloseModal={() => setIsOpen(false)}>
          {getInnerModal()}
          {(type === platformConfig.actionsConfig.sell.key) ? <AdvancedOptions 
            slippageTolerance={slippageTolerance} 
            setSlippageTolerance={setSlippageTolerance} 
          /> : <br/>}

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
            />

            {arbitrageConfig.actionsConfig[type] && <TimeToFullfill />}   

            {activeToken?.name === 'usdc' && <AdvancedOptions 
                slippageTolerance={slippageTolerance} 
                setSlippageTolerance={setSlippageTolerance} 
            />}
          </>
        }
        {renderActionComponent(isModal)}
    </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, isModal, isOpen, amountLabel, token, amount, setAmount, balances?.tokenAmount, view, protocol, type, slippageTolerance, setSlippageTolerance, renderActionComponent, activeToken?.name])
};

const AdvancedOptions = ({slippageTolerance, setSlippageTolerance}) => {
  const { activeView } = useContext(appViewContext);
  if(activeView !== "trade") return null;
  return <Expand header="Advanced" classNames="advanced-expand" expandedView={<Slippage slippageTolerance={slippageTolerance} setSlippageTolerance={setSlippageTolerance} />} />
}

export default ActionController;
