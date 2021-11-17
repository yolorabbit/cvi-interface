import Modal from 'components/Modal/Modal';
import React, { useEffect, useState } from 'react'
import config from 'config/config';
import './MaintenanceModal.scss';
import { useLocation } from 'react-router-dom';

const MaintenanceModal = ({ selectedNetwork }) => {
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const location = useLocation();

    const restrictedRoutesPathFiltered = Object.values(config.routes)
    .filter(({restricted}) => restricted)
    .map(({path}) => path.replace('/', ''));

    const isRestrictedRoute = () => restrictedRoutesPathFiltered.some(path => location.pathname.includes(path));

    useEffect(() => {
        setShowMaintenanceModal(isRestrictedRoute() && selectedNetwork.toLowerCase() === 'matic')
    }, [selectedNetwork, location?.pathname])

    return showMaintenanceModal ? (
        <Modal className="maintenance-modal" clickOutsideDisabled>
            <img src={require('../../../images/icons/notifications/maintenance-triangle.svg').default} alt="warning" />
            <p><b>Dear Community,</b></p>
            <p>CVI platform will undergo an upgrade for the upcoming improved AMM and migration launch. During the next 2 hours, the CVI platform on Polygon network won't be available. We will notify once the upgrade is complete, and the migration is available for users of both Ethereum and Polygon networks</p>
            <p>Best regards,<span>CVI Team</span></p>
            <p className="comment">* To go back to Ethereum network please switch to Ethereum mainnet in your wallet</p>
        </Modal>
    ) : null
}

export default MaintenanceModal;