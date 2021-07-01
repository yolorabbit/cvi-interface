import { useActionController } from './ActionController';
import React from 'react'
import platformConfig from 'config/platformConfig';
import stakingConfig from 'config/stakingConfig';
import PlatformActions from './PlatformActions';
import StakingActions from './StakingActions';
import ConnectWallet from 'components/ConnectWallet/ConnectWallet';
import './Action.scss';

const Action = () => {
    const { type } = useActionController();
    const account = "sdg";
    if(!account) return <ConnectWallet type="action" />
    if(platformConfig.actionsConfig?.[type]) return <PlatformActions />;
    if(stakingConfig.actionsConfig?.[type]) return <StakingActions />;
    return null;
}

export default Action;