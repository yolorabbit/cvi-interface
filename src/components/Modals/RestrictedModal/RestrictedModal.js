import Button from 'components/Elements/Button';
import Modal from 'components/Modal/Modal';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import './RestrictedModal.scss';

const RestrictedModal = () => {
    const [showRestrictedModal, setShowRestrictedModal] = useState();
    const location = useLocation();
    const history = useHistory();

    const checkRestrictedCountry = () => {
        try {
            if(location.pathname.includes('/help')) return;
            const isRestrictedCheck = localStorage.getItem('restrictedCountryCheck');

            if (isRestrictedCheck !== "true") {
                setShowRestrictedModal(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const confirmButton = () => {
        localStorage.setItem('restrictedCountryCheck', true);
        setShowRestrictedModal(false);
    }

    const onIsCitizen = () => {
        setShowRestrictedModal(false);
        history.push('/help');
    }

    useEffect(() => {
        if(!location?.pathname) return;
        checkRestrictedCountry();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.pathname]);

    return showRestrictedModal ? (
        <Modal className="restricted-modal" clickOutsideDisabled>
            <img src={require('../../../images/icons/notifications/notice.svg').default} alt="warning" />
            <p>Please confirm you are not a resident in one of CVI's restricted jurisdictions detailed in the website terms and conditions, including United States, Israel and Gibraltar</p>

            <div className="restricted-modal___actions">
                <Button className="button" onClick={confirmButton} buttonText="Continue to CVI platform" />
                <Button className="button" onClick={onIsCitizen} buttonText="Cancel" />
            </div>
        </Modal>
    ) : null
}

export default RestrictedModal;