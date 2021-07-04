import { useWeb3React } from '@web3-react/core';
import Button from 'components/Elements/Button';
import Title from 'components/Elements/Title';
import Modal from 'components/Modal';
import config from 'config/config';
import { chainNames, ConnectorNames, networksFormattedByEnv, supportedNetworksConfigByEnv } from 'connectors';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, setNetworkStatus, setSelectNetwork } from 'store/actions';
import { chainNameToChainId, getCurrentProviderName, parseHex } from 'utils';
import './SelectNetwork.scss';


const SelectNetwork = ({view}) => {
    const dispatch = useDispatch();
    const { selectedNetwork } = useSelector(({app}) => app);
    const networkContext = useWeb3React(config.web3ProviderId);
    const {chainId, library} = useWeb3React();
    const [isOpen, setIsOpen] = useState();
    const [warningModalIsOpen, setWarningModalIsOpen] = useState();

    const networksList = useMemo(() => Object.values(supportedNetworksConfigByEnv).map(({chainId}) => ({
        chainId: parseHex(chainId),
        chainName: supportedNetworksConfigByEnv[parseHex(chainId)].chainName, 
        name: networksFormattedByEnv[parseHex(chainId)].name, 
        icon: networksFormattedByEnv[parseHex(chainId)].icon,
    })), []);

    const activeNetwork = networksFormattedByEnv[chainNameToChainId(selectedNetwork)];
    const providerName = getCurrentProviderName(library?.currentProvider);

    const onSelectNetwork = async (hexChainId) => {
        try {
            const _selectedNetwork = supportedNetworksConfigByEnv[parseHex(hexChainId)];
            dispatch(setNetworkStatus(config.networkStatuses.pending));
            if(_selectedNetwork && window.ethereum?.request && window.ethereum.selectedAddress) {
                if(_selectedNetwork.chainName !== chainNames.Ethereum) {
                    await window.ethereum.request({method: 'wallet_addEthereumChain', params: [_selectedNetwork]});
                } else {
                    if(chainId === chainNameToChainId(_selectedNetwork.chainName)) {
                        await networkContext.connector.changeChainId(parseHex(_selectedNetwork.chainId));
                    } else {
                        setIsOpen(false);
                        return setWarningModalIsOpen(true);
                    };
                }
            }
            
            await networkContext.connector.changeChainId(parseHex(_selectedNetwork.chainId));
            
            dispatch(setSelectNetwork(_selectedNetwork.chainName));
        } catch(error) {
            console.log(error);
            dispatch(addAlert({
                id: "switch-network",
                message: "Some error occurred while trying to select a new network.",
                alertType: config.alerts.types.FAILED,
                eventName: "select network error"
            }));
            
        } finally {
            setTimeout(() => {
                dispatch(setNetworkStatus(config.networkStatuses.connected));
            }, 800);
        }
    }

    return (
        <div className={`select-network-component ${view ?? ''}`}>
            {warningModalIsOpen && <Modal className="error-modal sell-all-modal" closeIcon handleCloseModal={() => setWarningModalIsOpen(false)}> 
                <img src={require('images/icons/notifications/notice.svg').default} alt="notice red icon" width="80" height="80" />

                <h2><br/>
                    Please switch to Ethereum {config.isMainnet ? 'Mainnet' : 'Testnet'} in your wallet
                </h2>

                <Button className="error-modal__close button navbar-button" buttonText="CLOSE" onClick={() => setWarningModalIsOpen(false)} />
            </Modal>}

            {isOpen && <Modal className="select-network-component__modal" closeIcon handleCloseModal={() => setIsOpen(false)}>
                <Title className="select-network-title xs-center" color="white" text="Select a network" borderColor="#f8ba15"/>
                <p>You are currently browsing CVI on the {activeNetwork.name} network.</p>

                <div className="networks-list-component">
                {networksList.map(({name, icon, chainName, chainId}, index) => <Button 
                        disabled={providerName === ConnectorNames.WalletConnect && chainNames.Matic === chainName} 
                        className={`button ${activeNetwork.name === name ? 'network-active' : ''}`} 
                        key={index} 
                        onClick={() => onSelectNetwork(chainId)
                    }>
                        {icon && <img src={require(`../../images/networks/${icon}`).default} alt={icon} /> }
                        {name}
                    </Button>)}
                </div>
            </Modal>}

            <Button onClick={() => setIsOpen(true)}>
                {activeNetwork.icon && <img src={require(`../../images/networks/${activeNetwork.icon}`).default} alt={activeNetwork.icon } /> }
                {activeNetwork.name}
            </Button> 
        </div>
    )
}

export default SelectNetwork;