import Button from 'components/Elements/Button';
import Modal from 'components/Modal/Modal';
import config from 'config/config';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import './RestrictedModal.scss';

const RestrictedModal = () => {
    const [showRestrictedModal, setShowRestrictedModal] = useState();
    const location = useLocation();
    const history = useHistory();

    const checkRestrictedCountry = async () => {
        try {
            const restrictedRoutesPathFiltered = Object.values(config.routes)
                .filter(({restricted}) => restricted)
                .map(({path}) => path.replace('/', ''));

            const isRestrictedRoute = restrictedRoutesPathFiltered.some(path => location.pathname.includes(path));
            
            
            await new Promise((resolve, reject) => setTimeout(() => {
                resolve()
            }, 500));

            if(isRestrictedRoute) {
                setShowRestrictedModal(true);
                history.push('/');
            }

        } catch (error) {
            console.log(error);
        }
    }

    const confirmButton = () => {
        setShowRestrictedModal(false);
    }

    useEffect(() => {
        if(!location?.pathname) return;
        checkRestrictedCountry();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.pathname]);

    return showRestrictedModal ? (
        <Modal className="restricted-modal" clickOutsideDisabled>
            <img src={require('../../../images/icons/notifications/notice.svg').default} alt="warning" />
            <p>Access to the CVI trading platform is restricted for users from your country. If you have any queries, please contact support team.</p>

            <div className="restricted-modal___actions">
                <Button className="button" onClick={confirmButton} buttonText="OK" />
            </div>
        </Modal>
    ) : null
}

export default RestrictedModal;