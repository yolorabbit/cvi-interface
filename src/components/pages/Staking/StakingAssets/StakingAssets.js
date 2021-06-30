import { useIsTablet } from 'components/hooks';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import { chainNames } from 'config/config';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { useMemo } from 'react'
import './StakingAssets.scss';

const StakingAssets = ({type}) => {
    const isTablet = useIsTablet();
 
    return useMemo(() => {
        const selectedNetwork = chainNames.Ethereum;
        const liquidityMiningProtocols = stakingConfig.tokens[selectedNetwork];
        const liquidityMiningProtocolsValues = Object.values(liquidityMiningProtocols);
        const liquidityMiningTokens = liquidityMiningProtocolsValues.map(protocol => Object.values(protocol));
        const stakingAssetsData = liquidityMiningTokens.reduce((prev, next) => prev.concat(next));

        return (
            <div className="staked-assets-component">
                {isTablet ? 
                    <ExpandList 
                        activeTab={type} 
                        data={stakingAssetsData} 
                        showPaginator={type === stakingViews.staked} 
                        authGuard={type === stakingViews.staked}
                        subHeaders={stakingConfig.tableSubHeaders[type]}
                    /> 
                    : <Table 
                        activeTab={type} 
                        data={stakingAssetsData} 
                        showPaginator={type === stakingViews.staked} 
                        authGuard={type === stakingViews.staked}
                        subHeaders={stakingConfig.tableSubHeaders[type]}
                    />}
            </div>
        )
    }, [isTablet, type]);
}

export default StakingAssets;