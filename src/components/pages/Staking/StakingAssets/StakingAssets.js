import { useIsTablet } from 'components/Hooks';
import useAssets from 'components/Hooks/useAssets';
import DataController from 'components/Tables/DataController';
import ExpandList from 'components/Tables/ExpandList';
import Table from 'components/Tables/Table';
import { stakingProtocols, stakingViews } from 'config/stakingConfig';
import { delay } from 'lodash';
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import './StakingAssets.scss';

const StakingAssets = ({type}) => {
    const [update, forceUpdate] = useState(false);
    const filteredAssets = useAssets(type, update);
    const { selectedNetwork } = useSelector(({app}) => app);

    return useMemo(() => {
        const tableLpTokensSubHeaderPosition = filteredAssets?.filter(({protocol}) => protocol === stakingProtocols.platform)?.length;
        const tableSubHeaders = {
            0: "Platform tokens",
            [tableLpTokensSubHeaderPosition]: "Liquidity mining"
        }

        return (
            <div className="staked-assets-component">
                <DataController
                    activeTab={type} 
                    data={filteredAssets} 
                    showPaginator={type === stakingViews.staked} 
                    authGuard={type === stakingViews.staked}
                    subHeaders={tableLpTokensSubHeaderPosition && tableSubHeaders}
                    cb={()=>delay(()=>forceUpdate(!update),5000)}
                >
                    <DataView />
                </DataController>
            </div>
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredAssets, selectedNetwork, update]);
}

const DataView = () => {
    const isTablet = useIsTablet();
    return useMemo(() => {
        return isTablet ? <ExpandList /> : <Table />
    }, [isTablet]);
}

export default StakingAssets;