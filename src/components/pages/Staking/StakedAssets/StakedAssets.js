import { useIsTablet } from 'components/hooks';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import { chainNames } from 'config/config';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { useMemo } from 'react'
import './StakedAssets.scss';

const StakedAssets = () => {
    const isTablet = useIsTablet();
 
    return useMemo(() => {
        const selectedNetwork = chainNames.Ethereum;
        const liquidityMiningProtocols = stakingConfig.tokens[selectedNetwork];
        const liquidityMiningProtocolsValues = Object.values(liquidityMiningProtocols);
        const liquidityMiningTokens = liquidityMiningProtocolsValues.map(protocol => Object.values(protocol));
        const stakedAssetsData = liquidityMiningTokens.reduce((prev, next) => prev.concat(next));

        return (
            <div className="staked-assets-component">
                {isTablet ? 
                    <ExpandList activeTab={stakingViews.staked} data={stakedAssetsData} /> 
                    : <Table activeTab={stakingViews.staked} data={stakedAssetsData} />}
            </div>
        )
    }, [isTablet]);
}

export default StakedAssets;