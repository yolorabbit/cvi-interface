import { useIsTablet } from 'components/Hooks';
import useAssets from 'components/Hooks/useAssets';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import './StakingAssets.scss';

const StakingAssets = ({type}) => {
    const isTablet = useIsTablet();
    const filteredAssets = useAssets(type);
    const { selectedNetwork } = useSelector(({app}) => app);

    return useMemo(() => {
        return (
            <div className="staked-assets-component">
                <DataController
                    activeTab={type} 
                    data={filteredAssets} 
                    showPaginator={type === stakingViews.staked} 
                    authGuard={type === stakingViews.staked}
                    subHeaders={stakingConfig.tableSubHeaders?.[type]?.[selectedNetwork]}
                >
                    {isTablet ? <ExpandList /> : <Table />}
                </DataController>
            </div>
        ) //eslint-disable-next-line
    }, [isTablet, filteredAssets, selectedNetwork]);
}

export default StakingAssets;