import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import InputAmount from 'components/InputAmount';
import { platformViewContext } from 'components/Context';
import Action from './Action';

export const actionControllerContext = createContext({});
export const ActionControllerContext = ({token, type, leverage, amount, setAmount, isModal, isOpen, setIsOpen}) => {
  return (
    <actionControllerContext.Provider value={{ type, token, leverage, amount, setAmount, isModal, isOpen, setIsOpen }}>
      <Action />
    </actionControllerContext.Provider>
  )
}

export const useActionController = () => {
  const context = useContext(actionControllerContext);
  return context;
}

const ActionController = ({type, amountLabel = "Amount", token, leverage, amount, setAmount, isModal}) => {
  const [isOpen, setIsOpen] = useState();
  const { activeView } = useContext(platformViewContext);

  const renderActionComponent = (isModal = false) => {
    return <ActionControllerContext type={type} token={token} leverage={leverage} amount={amount} setAmount={setAmount} isOpen={isOpen} isModal={isModal} setIsOpen={setIsOpen} />
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
  }, [type, activeView, amount, isOpen, isModal, token, amountLabel])
};

export default ActionController;
