import Container from 'components/Layout/Container';
import DataController from 'components/Tables/DataController';
import Table from 'components/Tables/Table';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import './PlatformsStats.scss';
import { arrayIsLoaded, commaFormatted } from '../../../../../utils';
import commonApi from '../../../../../contracts/commonApi';
import { isEmpty } from 'lodash';
import { useIsMobile } from 'components/Hooks';
import platformConfig from 'config/platformConfig';


const PlatformsStats = ({liquidityPools, platformBalance}) => {
    const { selectedNetwork } = useSelector(({app}) => app);
    const isMobile = useIsMobile();
    
    return useMemo(() => {
        const initialPlatformStatsData = [{
            index: null,
            liquidityPools: null,
            openPositions: null,
        }];
        
        const _openPositions = () => {
            if(!liquidityPools || !platformBalance) return null;
            if(liquidityPools?.length !== platformBalance?.length) return "N/A";
            if(liquidityPools === "N/A" || platformBalance === "N/A") return "N/A";
            return platformBalance?.map((item, index) => [`${commaFormatted(commonApi.getTradersPoolSize(item[1], liquidityPools[index][1]))} (${item[2]?.toUpperCase()} pool)`, liquidityPools[index][3]])
        }
        const openPositions = _openPositions(); // calculate open positions for active tokens
        const liquidityPoolsLoaded = arrayIsLoaded(liquidityPools);
        const openPositionsLoaded = arrayIsLoaded(openPositions);
        const activeOracles = liquidityPoolsLoaded.reduce((current, item) => ({...current, [item[3]]: item[3]}), {});
     
        const rowData = Object.values(activeOracles).map(oracle => ({ // map row data by oracle.
            index: oracle.toUpperCase(), // oracle to index display name
            liquidityPools: liquidityPoolsLoaded.filter(pool => pool !== "N/A" && pool[3] === oracle), // filter by oracle
            openPositions: openPositionsLoaded.filter(pool => pool !== "N/A" && pool[1] === oracle), // filter by oracle
        }));

        return <Container className="platform-stats-container">
            <div key={selectedNetwork} className="statistics-component">
                <DataController 
                    customTableHeaders={isMobile ? [] : Object.values(platformConfig.headers.stats)}
                    activeTab="stats" 
                    data={isEmpty(rowData) ? initialPlatformStatsData : rowData}
                >
                    <Table />
                </DataController>
            </div>
            
        </Container>
    }, [isMobile, liquidityPools, platformBalance, selectedNetwork])
}

export default PlatformsStats;