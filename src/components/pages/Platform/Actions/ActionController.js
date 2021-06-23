import React, { createContext, useContext, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';

export const actionControllerContext = createContext({});
export const ActionControllerContext = ({children, token, leverage, amount, setAmount, isModal, setIsOpen}) => {
  return (
    <actionControllerContext.Provider value={{ token, leverage, amount, setAmount, isModal, setIsOpen }}>
      {children}
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const { token, leverage, amount, isModal, setIsOpen, setAmount } = useContext(actionControllerContext);
  return { token, leverage, amount, setAmount, isModal, setIsOpen };
}

const ActionController = ({token, leverage, amount, setAmount, actionComponent, isModal}) => {
  const [isOpen, setIsOpen] = useState();

  const renderActionComponent = (isModal = false) => {
    return <ActionControllerContext token={token} leverage={leverage} amount={amount} setAmount={setAmount} isModal={isModal} setIsOpen={setIsOpen}>
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
        <h1>{token}</h1>
        <h1>{amount}</h1>

        <InputAmount 
          label="Amount" 
          symbol={token} 
          balance="100000" 
          amount={amount} 
          setAmount={setAmount} 
        />

        {renderActionComponent()}
      </Modal>}

      {!isModal && <InputAmount 
        label="Amount" 
        symbol={token} 
        balance="100000" 
        amount={amount} 
        setAmount={setAmount} /> 
      }

      {renderActionComponent(isModal)}
  </div>
};

export default ActionController;
