import React from 'react'
import { useActionController } from './ActionController';
import platformConfig from 'config/platformConfig';
import stakingConfig from 'config/stakingConfig';
import PlatformActions from './PlatformActions';
import StakingActions from './StakingActions';
import './Action.scss';

const Action = () => {
    const { type } = useActionController();
    
    if(platformConfig.actionsConfig?.[type]) return <PlatformActions />;
    if(stakingConfig.actionsConfig?.[type]) return <StakingActions />;
    return null;
}

export default Action;