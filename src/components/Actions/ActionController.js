import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';
import { platformViewContext } from 'components/Context';
import Action from './Action';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useWeb3Api } from 'contracts/useWeb3Api';

const actionControllerContext = createContext({});
export const ActionControllerContext = ({disabled, token, protocol, type, leverage, amount, setAmount, isModal, isOpen, setIsOpen, updateAvailableBalance, balances, cb }) => {
  return (
    <actionControllerContext.Provider value={{disabled, type, token, protocol, leverage, amount, setAmount, isModal, isOpen, setIsOpen, updateAvailableBalance, balances, cb }}>
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


  const renderActionComponent = (isModal = false) => {
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
  }

  useEffect(() => {
    if(!isOpen && amount !== "") {
      setAmount("");
    }
    //eslint-disable-next-line
  }, [isOpen, activeView]);

  
  return useMemo(() => {
    return <div className="action-controller-component">
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

        {!isModal && <InputAmount 
            label={amountLabel}
            symbol={token} 
            amount={amount} 
            setAmount={setAmount} 
            setInsufficientBalance={setInsufficientBalance}
            availableBalance={balances?.tokenAmount}
            protocol={protocol}
          /> 
        }

        {renderActionComponent(isModal)}
    </div>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModal, isOpen, amountLabel, token, amount, setAmount, balances?.tokenAmount, view, protocol])
};

export default ActionController;
