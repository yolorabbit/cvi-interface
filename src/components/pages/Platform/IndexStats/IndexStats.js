import DataController from 'components/Tables/DataController';
import Table from 'components/Tables/Table';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import Stat from 'components/Stat';
import IndexValue from './IndexValue';
import './IndexStats.scss';
import { useIsMobile } from 'components/Hooks';
import config from 'config/config';
import platformConfig from 'config/platformConfig';

const IndexStats = ({type}) => {
    return useMemo(() => {
        return (
            <div key={type} className={`index-stats-component ${type === 'home' ? 'cvi-stats-component' : ''}`}>
                <div className={`index-stats-component__container ${type === 'home' ? 'cvi-stats-component__container' : ''}`}>
                    {type === "home" ? 
                        <HomeDefaultIndex type={type} /> : 
                        <IndexsTable />
                    }
                </div>  
            </div>
        )
    }, [type]) 
}

const HomeDefaultIndex = ({type}) => {
    const { cviVolInfo } = useSelector(({app}) => app.indexInfo);
    return useMemo(() => {
        return  <> 
            <IndexValue type={type} />
            <Stat title="Previous hour" value={cviVolInfo?.oneHourAgo} />
            <Stat prefix="" className="green" title="Last week high" value={cviVolInfo?.cviOneWeekHigh}/>
            <Stat prefix="" className="red" title="Last week low" value={cviVolInfo?.cviOneWeekLow}/>
        </>
    }, [cviVolInfo?.cviOneWeekHigh, cviVolInfo?.cviOneWeekLow, cviVolInfo?.oneHourAgo, type])
}

const IndexsTable = () => {
    const indexsInfo = useSelector(({app}) => app.indexInfo);
    const isMobile = useIsMobile();

    return useMemo(() => {
        const loadIndexsInfo = () => {
            return Object.values(config.volatilityKey).map(key => indexsInfo[key]);
        }

        const indexsList = loadIndexsInfo();
        const hasSomeVolInfo = indexsList.some(vol => vol !== null);
   
        return <DataController 
            customTableHeaders={isMobile ? [] : platformConfig.headers.index}
            activeTab="index" 
            data={hasSomeVolInfo ? indexsList.filter(vol => vol?.index) : indexsList}
        >
           <Table />
           {indexsInfo?.cviVolInfo?.time && <span className="last-update-date">{indexsInfo?.cviVolInfo?.time}</span> }
        </DataController>
    }, [indexsInfo, isMobile])
}

export default IndexStats;