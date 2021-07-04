import React from 'react'
import { Link } from 'react-router-dom';
import ConnectWallet from 'components/ConnectWallet';
import { useSelector } from 'react-redux';
import { chainNames } from 'connectors';
import './MyWalletModal.scss';
import Modal from 'components/Modal/Modal';
import Title from 'components/Elements/Title';
import Copy from 'components/Copy/Copy';

export const MyWalletModal = ({address, setModalIsOpen}) => {
    const { selectedNetwork } = useSelector(({app}) => app);

    const scanUrls = {
        [chainNames.Ethereum]: `https://etherscan.io/address/${address}`,
        [chainNames.Matic]: `https://polygon-explorer-mainnet.chainstacklabs.com/address/${address}`,
    }

    return (
        <Modal id="my-wallet-modal" clickOutsideDisabled closeIcon handleCloseModal={() => setModalIsOpen(false)}>
            <Title className="xs-center" color="white" borderColor="#f8ba15" text="Account"/>
   
            <div className="account-info">
                <p className="address">{address}</p>
                <div className="account-info__actions">
                    <Copy title="Copy address" text={address} />

                    <Link to={{pathname: scanUrls[selectedNetwork]}} target="_blank" rel="noopener noreferrer">
                        <img src={require('../../../images/icons/open-browser.svg').default} alt="EtherScan" />
                        {selectedNetwork === chainNames.Ethereum ? <span>View on EtherScan</span> : <span>View on polygon explorer</span> }
                    </Link>
                </div>
                
                <ConnectWallet type="change" />
            </div>
        </Modal>
    )
}

export default MyWalletModal;