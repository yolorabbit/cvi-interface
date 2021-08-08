import { useIsTablet } from 'components/Hooks';
import useAssets from 'components/Hooks/useAssets';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import { delay } from 'lodash';
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import './StakingAssets.scss';

const StakingAssets = ({type}) => {
    const [update, forceUpdate] = useState(false);
    const filteredAssets = useAssets(type, update);
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
                    cb={()=>delay(()=>forceUpdate(!update),5000)}
                >
                    <DataView />
                </DataController>
            </div>
        )
    }, [filteredAssets, selectedNetwork, type, update]);
}

const DataView = () => {
    const isTablet = useIsTablet();
    return useMemo(() => {
        return isTablet ? <ExpandList /> : <Table />
    }, [isTablet]);
}

export default StakingAssets;