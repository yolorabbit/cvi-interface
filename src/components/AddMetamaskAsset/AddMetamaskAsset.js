import Button from 'components/Elements/Button';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import config from 'config/config';
import stakingConfig from 'config/stakingConfig';
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from 'store/actions';
import './AddMetamaskAsset.scss';
import { ConnectorNames, connectorsByName, defaultChainId, supportedNetworksConfigByEnv } from './../../connectors';
import { chainNameToChainId } from 'utils';
import { useWeb3React } from '@web3-react/core';

const AddMetamaskAsset = ({token, protocol}) => {
    const { selectedNetwork } = useSelector(({app}) => app);
    const { activate } = useWeb3React();
    const { library, account} = useActiveWeb3React();
    const dispatch = useDispatch();

    const activeToken = useMemo(() => {
        if(!selectedNetwork || !protocol || !token) return;
        return stakingConfig.tokens[selectedNetwork][protocol][token]
    }, [selectedNetwork, protocol, token]);
    
    // @TODO: move this to util function / hook (can be reuse)
    const connectToMetamask = async () => {
        try {
            await activate(connectorsByName[ConnectorNames.MetaMask], (error) => {
                console.log(error);
            }).then(async () => {
                if(!await switchNetwork()) throw new Error();
            });
        } catch(error) {
            console.log(error);
        }
    }

    // @TODO: move this to util function / hook  (can be reuse)
    const switchNetwork = async () => {
        try {
            const chainId = chainNameToChainId(selectedNetwork)
            const selectedNetworkParam = supportedNetworksConfigByEnv?.[chainId] ?? defaultChainId;
            
            if(selectedNetworkParam && window?.ethereum?.request) {
                await window.ethereum.request({method: 'wallet_addEthereumChain', params: [selectedNetworkParam, account]});
            }
            return true;
        } catch(error) {
            console.log(error);
            if(error) {
                if(error.message?.toLowerCase()?.includes("may not specify default metamask chain.")) {
                    dispatch(addAlert({
                        id: "switch-network",
                        message: "Cannot switch to Ethereum network. please change it manually.",
                        alertType: config.alerts.types.FAILED,
                        eventName: "select network error"
                    }))
                } else if(error.message?.toLowerCase()?.includes("user rejected the request.")) {
                    dispatch(addAlert({
                        id: "switch-network",
                        message: "Switch network rejected.",
                        alertType: config.alerts.types.FAILED,
                        eventName: "select network error"
                    }));
                } else {
                    dispatch(addAlert({
                        id: "switch-network",
                        message: "Cannot switch network. please change it manually.",
                        alertType: config.alerts.types.FAILED,
                        eventName: "select network error"
                    }));
                }
            }
            return false;
        }
    }


    const onClick = async () => {
        try {
            await connectToMetamask();

            const wasAdded = await library.currentProvider.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20',
                options: {
                    address: activeToken.address,
                    symbol: activeToken.label,
                    decimals: activeToken.decimals,
                },
              },
            });
            
            if (wasAdded) {
                dispatch(addAlert({
                    id: 'add-token',
                    eventName: "Add token - success",
                    alertType: config.alerts.types.CONFIRMED,
                    message: "Add token successfully"
                }));
            } else {
                dispatch(addAlert({
                    id: 'add-token',
                    eventName: "Failed to add token.",
                    alertType: config.alerts.types.FAILED,
                    message: "Add token failed"
                }));
            }
          } catch (error) {
            console.log(error.message);
            dispatch(addAlert({
                id: 'add-token',
                eventName: "Add token - failed",
                alertType: config.alerts.types.FAILED,
                message: "Failed to add token."
            }));
          }
    }
    
    return useMemo(() => {
        // if(!mmInstalled) return null;
        return (
            <Button className="metamask-asset-component external-link" onClick={onClick} title="View on Metamask">
                <img className="external-link" src={require('images/icons/metamask.svg').default} alt="metamask" />
            </Button>
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export default AddMetamaskAsset;