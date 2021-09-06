import React, { useMemo } from 'react'
import CviValue from './CviValue';
import Stat from 'components/Stat';
import { useSelector } from 'react-redux';
import './CviStats.scss';

const CviStats = ({type}) => {
    const { cviInfo } = useSelector(({app}) => app.cviInfo);

    return useMemo(() => {
        return (
            <div className="cvi-stats-component">
                <div className="cvi-stats-component__container">
                    <CviValue type={type} />
                    <Stat title="Previous hour" value={cviInfo?.cviOneHourAgo} />
                    <Stat prefix="" className="green" title="Last week high" value={cviInfo?.cviOneWeekHigh}/>
                    <Stat prefix="" className="red" title="Last week low" value={cviInfo?.cviOneWeekLow}/>
                </div>
            </div>
        )
    }, [cviInfo?.cviOneWeekHigh, cviInfo?.cviOneWeekLow, cviInfo?.cviOneHourAgo, type]) 
}

export default CviStats;