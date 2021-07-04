import ConnectWallet from 'components/ConnectWallet/ConnectWallet';
import { platformViewContext } from 'components/Context';
import EmptyData from 'components/EmptyData/EmptyData';
import { useActiveWeb3React } from 'components/hooks/wallet';
import platformConfig from 'config/platformConfig';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { createContext, useContext, useEffect, useState } from 'react'


const dataControllerContext = createContext({});
export const useDataController = () => {
    const context = useContext(dataControllerContext);
    return context;
}

const DataController = ({children, data = [], subHeaders = {}, activeTab, authGuard, pageSize = 5, showPaginator}) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);
    const { account } = useActiveWeb3React();
    const activeTabLabel = stakingConfig.stakingConnectLabels?.[activeTab] ?? activeTab?.toLowerCase();

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    if(!account && authGuard) return <ConnectWallet type="table table-component auth-guard" buttonText={`to view ${activeTabLabel}`} />

    if(!data?.length) return <EmptyData text={`You have no ${activeTabLabel ?? 'data'}`} />

    if(!activeTab || 
        (activeView && !platformConfig.headers?.[activeView]?.[activeTab]) ||
        (!activeView && !stakingConfig.headers?.[activeTab])) return null;

    const tableHeaders = stakingViews?.[activeTab] ? Object.values(stakingConfig.headers?.[activeTab]) :  
        Object.values(platformConfig.headers?.[activeView]?.[activeTab]);

    const currentData = showPaginator ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : data;
    const _showPaginator = showPaginator && data.length > pageSize;

    return (
        <dataControllerContext.Provider value={{
            tableHeaders, 
            currentData,
            currentPage,
            showPaginator: _showPaginator,
            setCurrentPage,
            totalRecords: data.length,
            pageSize,
            activeTab,
            subHeaders
        }}>
            {children}
        </dataControllerContext.Provider>
    )
}

export default DataController;