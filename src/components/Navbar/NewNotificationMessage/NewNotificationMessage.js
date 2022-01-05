import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';
import './NewNotificationMessage.scss';

const NewNotificationMessage = ({type, setNotificationData}) => {
    
    return useMemo(() => {
        const closeNotification = () => {
            localStorage.setItem(type, 'close');
            setNotificationData('close');
        }

        return (
            <div className='new-notification-message-component'>
                <p>
                    The new GOVI staking V2 program is now live on Arbitrum and Polygon!
                    For more information on the new GOVI staking V2 program and how to bridge your tokens to Arbitrum <Link to="#">
                        click here
                    </Link>
                </p>

                <button className="new-notification-message-component__close-button" onClick={closeNotification}>
                    <img src={require("images/icons/close-no-bg.svg").default} alt="close icon" />
                </button>
            </div>
        );
    }, [setNotificationData, type])
}

export default NewNotificationMessage;