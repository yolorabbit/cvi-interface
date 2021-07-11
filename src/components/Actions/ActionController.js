import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';
import { platformViewContext } from 'components/Context';
import Action from './Action';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useWeb3Api } from 'contracts/useWeb3Api';

const actionControllerContext = createContext({});
export const ActionControllerContext = ({disabled, token, type, leverage, amount, setAmount, isModal, isOpen, setIsOpen, updateAvailableBalance }) => {
  return (
    <actionControllerContext.Provider value={{disabled, type, token, leverage, amount, setAmount, isModal, isOpen, setIsOpen, updateAvailableBalance }}>
      <Action />
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const context = useContext(actionControllerContext);
  return context;
}

const ActionController = ({type, disabled, amountLabel = "Amount", token, leverage, amount, setAmount, isModal}) => {
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [isOpen, setIsOpen] = useState();
  const { activeView } = useContext(platformViewContext);
  const { account } = useActiveWeb3React();
  const availableBalancePayload = useMemo(() => ({account, type}), [account, type]);
  const [availableBalance, getAvailableBalance] = useWeb3Api("getAvailableBalance", token, availableBalancePayload);
  
  const updateAvailableBalance = () => {
    getAvailableBalance();
  }

  const renderActionComponent = (isModal = false) => {
    return <ActionControllerContext 
        disabled={!(!disabled && !insufficientBalance)}
        type={type} 
        token={token} 
        leverage={leverage} 
        amount={amount} 
        setAmount={setAmount} 
        isOpen={isOpen} 
        isModal={isModal} 
        setIsOpen={setIsOpen}
        updateAvailableBalance={updateAvailableBalance} 
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
        {(isModal && isOpen) && <Modal closeIcon handleCloseModal={() => setIsOpen(false)}>
          <InputAmount 
            label={amountLabel}
            symbol={token} 
            amount={amount} 
            setAmount={setAmount} 
            setInsufficientBalance={setInsufficientBalance}
            availableBalance={availableBalance}
          />

          {renderActionComponent()}
        </Modal>}

        {!isModal && <InputAmount 
            label={amountLabel}
            symbol={token} 
            amount={amount} 
            setAmount={setAmount} 
            setInsufficientBalance={setInsufficientBalance}
            availableBalance={availableBalance}
          /> 
        }

        {renderActionComponent(isModal)}
    </div>
    //eslint-disable-next-line
  }, [type, activeView, amount, isOpen, isModal, token, amountLabel, insufficientBalance, availableBalance])
};

export default ActionController;
