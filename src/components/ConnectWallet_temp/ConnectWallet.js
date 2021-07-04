import React from 'react';
import Button from 'components/Elements/Button';
import './ConnectWallet.scss';

const ConnectWallet = ({type, buttonText = ""}) => {
    return (
        <div className={`connect-wallet-component ${type ?? ''}`}>
            <ConnectButton buttonText={buttonText} />
        </div>
    )
}

const ConnectButton = ({buttonText}) => {
    return <Button buttonText={buttonText} />
}

export default ConnectWallet;
