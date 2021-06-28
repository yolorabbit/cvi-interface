import { useIsTablet } from 'components/hooks';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { useMemo } from 'react'
import './StakedAssets.scss';

const StakedAssets = () => {
    const isTablet = useIsTablet();
    return useMemo(() => {
        return (
            <div className="staked-assets-component">
                {isTablet ? 
                    <ExpandList activeTab={stakingViews.staked} data={stakingConfig.tokens} /> 
                    : <Table activeTab={stakingViews.staked} data={stakingConfig.tokens} />}
            </div>
        )
    }, [isTablet]);
}

export default StakedAssets;