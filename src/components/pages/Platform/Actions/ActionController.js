import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';
import { platformViewContext } from 'components/Context';

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
  const { activeView } = useContext(platformViewContext);

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
  }, [isOpen, activeView]);

  return useMemo(() => {
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
    //eslint-disable-next-line
  }, [amount, isOpen, isModal, token, amountLabel])
};

export default ActionController;
