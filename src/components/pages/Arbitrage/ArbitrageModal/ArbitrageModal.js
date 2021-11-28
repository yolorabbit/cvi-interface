import React from "react";
import Modal from "../../../Modal";
import { activeTabs as arbitrageActiveViews } from "config/arbitrageConfig";
import { lazy, Suspense, useCallback, useMemo } from "react";
import "./ArbitrageModal.scss";

const Burn = lazy(() => import('./Views/Burn'));
const Mint = lazy(() => import('./Views/Mint'));

const ArbitrageModal = ({ setModalIsOpen, activeView }) => {
    console.log("activeView ", activeView)

    const getActiveView = useCallback(() => {
        switch(activeView) {
            case arbitrageActiveViews.burn: 
                return <Burn closeBtn={() => setModalIsOpen(false)} />

            case arbitrageActiveViews.mint: 
                return <Mint closeBtn={() => setModalIsOpen(false)} />

            default:
                return null; 
        }
    }, [activeView, setModalIsOpen]);

    return useMemo(() => {
        return (
            <div className="details-component">
                <div className="details-component__container">
                    <Suspense fallback={<></>}>
                      <Modal className="arbitrage-modal" closeIcon clickOutsideDisabled handleCloseModal={() => setModalIsOpen(false)} >
                        {getActiveView()}
                      </Modal>
                    </Suspense>
                </div>
            </div>
        )
    }, [getActiveView, setModalIsOpen]); 
}

export default ArbitrageModal;
