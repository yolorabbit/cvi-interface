import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';
import Slippage from 'components/Slippage';
import Expand from 'components/Expand';
import { platformViewContext } from 'components/Context';
import Action from './Action';


const actionControllerContext = createContext({});
export const ActionControllerContext = ({disabled, token, protocol, type, leverage, amount, setAmount, isModal, isOpen, setIsOpen, balances, cb }) => {
  return (
    <actionControllerContext.Provider value={{disabled, type, token, protocol, leverage, amount, setAmount, isModal, isOpen, setIsOpen, balances, cb }}>
      <Action />
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const context = useContext(actionControllerContext);
  return context;
}

const ActionController = ({type, disabled, amountLabel = "Amount", token, leverage, amount, setAmount, isModal, view="platform", protocol, balances, cb}) => {
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [isOpen, setIsOpen] = useState();
  const { activeView } = useContext(platformViewContext);

  const renderActionComponent = useCallback((isModal = false) => {
    return <ActionControllerContext 
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
        cb={cb}
      />
  }, [amount, balances, cb, disabled, insufficientBalance, isOpen, leverage, protocol, setAmount, token, type])

  useEffect(() => {
    if(!isOpen && amount !== "") {
      setAmount("");
    }
    //eslint-disable-next-line
  }, [isOpen, activeView]);

  
  return useMemo(() => {
    return <div className="action-controller_component">
        {(isModal && isOpen) && <Modal clickOutsideDisabled closeIcon handleCloseModal={() => setIsOpen(false)}>
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
          {renderActionComponent()}
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
            />

            <Expand header="Advanced" classNames="advanced-expand" expandedView={<Slippage/>} />
          </>
        }
        {renderActionComponent(isModal)}
    </div>
  }, [isModal, isOpen, amountLabel, token, amount, setAmount, balances?.tokenAmount, view, protocol, renderActionComponent])
};

export default ActionController;
