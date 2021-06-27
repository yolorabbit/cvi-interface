import React, { createContext, useContext, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';

export const actionControllerContext = createContext({});
export const ActionControllerContext = ({children, token, leverage, amount, setAmount, isModal, isOpen, setIsOpen}) => {
  return (
    <actionControllerContext.Provider value={{ token, leverage, amount, setAmount, isModal, isOpen, setIsOpen }}>
      {children}
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const context = useContext(actionControllerContext);
  return context;
}

const ActionController = ({amountLabel = "Amount", token, leverage, amount, setAmount, actionComponent, isModal}) => {
  const [isOpen, setIsOpen] = useState();

  const renderActionComponent = (isModal = false) => {
    return <ActionControllerContext token={token} leverage={leverage} amount={amount} setAmount={setAmount} isOpen={isOpen} isModal={isModal} setIsOpen={setIsOpen}>
      {actionComponent}
    </ActionControllerContext>
  }

  useEffect(() => {
    if(!isOpen && amount !== "") {
      setAmount("");
    }
    //eslint-disable-next-line
  }, [isOpen]);

  return <div className="action-controller-component">
      {(isModal && isOpen) && <Modal closeIcon handleCloseModal={() => setIsOpen(false)}>
        <InputAmount 
          label={amountLabel}
          symbol={token} 
          balance="100000" 
          amount={amount} 
          setAmount={setAmount} 
        />

        {renderActionComponent()}
      </Modal>}

      {!isModal && <InputAmount 
        label={amountLabel}
        symbol={token} 
        balance="100000" 
        amount={amount} 
        setAmount={setAmount} /> 
      }

      {renderActionComponent(isModal)}
  </div>
};

export default ActionController;
