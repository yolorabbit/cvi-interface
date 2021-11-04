import ConnectWallet from 'components/ConnectWallet/ConnectWallet';
import { platformViewContext } from 'components/Context';
import EmptyData from 'components/EmptyData/EmptyData';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import platformConfig from 'config/platformConfig';
import stakingConfig, { stakingViews } from 'config/stakingConfig';
import React, { createContext, useContext, useEffect, useState } from 'react'


const dataControllerContext = createContext({});
export const useDataController = () => {
    const context = useContext(dataControllerContext);
    return context;
}

const DataController = ({children, data = [], subHeaders = {}, activeTab, authGuard, pageSize = 5, showPaginator, customTableHeaders, cb}) => {
    const { activeView } = useContext(platformViewContext);
    const [currentPage, setCurrentPage] = useState(1);
    const { account } = useActiveWeb3React();
    const activeTabLabel = stakingConfig.stakingConnectLabels?.[activeTab] ?? activeTab?.toLowerCase();

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, activeView]);

    if(!account && authGuard) return <ConnectWallet type="table table-component auth-guard" buttonText={`to view ${activeTabLabel}`} />
    
    if(!data?.length) return <EmptyData isSpinner={data === null} text={activeTabLabel === 'index' ? 'No data found.' : `You have no ${activeTabLabel ?? 'data'}`} />

    if(!activeTab) return null;
    if(!activeView && !stakingConfig.headers?.[activeTab]) return null; 
    if(activeView && (!platformConfig.headers?.[activeView]?.[activeTab] && !platformConfig.headers?.[activeTab])) return null;

    const tableHeaders = customTableHeaders || (stakingViews?.[activeTab] ? Object.values(stakingConfig.headers?.[activeTab]) :  
        Object.values(platformConfig.headers?.[activeView]?.[activeTab]));

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
            subHeaders,
            cb
        }}>
            {children}
        </dataControllerContext.Provider>
    )
}

export default DataController;