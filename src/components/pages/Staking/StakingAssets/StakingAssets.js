import { useIsTablet } from 'components/Hooks';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import './StakingAssets.scss';

const StakingAssets = ({type}) => {
    const isTablet = useIsTablet();
    const { selectedNetwork } = useSelector(({app}) => app);
    
    return useMemo(() => {
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
    }, [isTablet, type, selectedNetwork]);
}

export default StakingAssets;