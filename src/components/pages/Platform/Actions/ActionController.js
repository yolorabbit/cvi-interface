import React, { createContext, useContext, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';

export const actionControllerContext = createContext({});
export const ActionControllerContext = ({children, token, leverage, amount, isModal, setIsOpen}) => {
  return (
    <actionControllerContext.Provider value={{ token, leverage, amount, isModal, setIsOpen }}>
      {children}
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const { token, leverage, amount, isModal, setIsOpen } = useContext(actionControllerContext);
  return { token, leverage, amount, isModal, setIsOpen };
}

const ActionController = ({token, leverage, amount, setAmount, actionComponent, isModal}) => {
  const [isOpen, setIsOpen] = useState();

  const renderActionComponent = (isModal = false) => {
    return <ActionControllerContext token={token} leverage={leverage} amount={amount} isModal={isModal} setIsOpen={setIsOpen}>
      {actionComponent}
    </ActionControllerContext>
  }

  return <div className="action-controller-component">
      {isModal && isOpen && <Modal closeIcon handleCloseModal={() => setIsOpen(false)}>
        {renderActionComponent()}
      </Modal>}
      <InputAmount label="Amount" symbol={token} balance="100000" amount={amount} setAmount={setAmount} />
      
      {renderActionComponent(isModal)}
  </div>
};

export default ActionController;
