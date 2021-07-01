import { useIsTablet } from 'components/hooks';
import DataController from 'components/Tables/DataController';
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
                <DataController
                    activeTab={type} 
                    data={stakingAssetsData} 
                    showPaginator={type === stakingViews.staked} 
                    authGuard={type === stakingViews.staked}
                    subHeaders={stakingConfig.tableSubHeaders[type]}
                >
                    {isTablet ? <ExpandList /> : <Table />}
                </DataController>
            </div>
        )
    }, [isTablet, type]);
}

export default StakingAssets;