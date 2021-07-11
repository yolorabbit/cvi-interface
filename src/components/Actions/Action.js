import React from 'react'
import { useActionController } from './ActionController';
import platformConfig from 'config/platformConfig';
import stakingConfig from 'config/stakingConfig';
import PlatformActions from './PlatformActions';
import StakingActions from './StakingActions';
import './Action.scss';
import ConnectWallet from 'components/ConnectWallet';
import { useActiveWeb3React } from 'components/Hooks/wallet';

const authGuard = {
    "buy": true,
    "deposit": true
}

const Action = () => {
    const { account } = useActiveWeb3React();
    const { type } = useActionController();

    if(!account && authGuard[type]) return <ConnectWallet type="action auth-guard" />
    if(platformConfig.actionsConfig?.[type]) return <PlatformActions />;
    if(stakingConfig.actionsConfig?.[type]) return <StakingActions />;
    return null;
}

export default Action;