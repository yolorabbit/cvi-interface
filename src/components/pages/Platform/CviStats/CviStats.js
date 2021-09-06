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
                    <Stat title="Previous hour" value={cviInfo?.previousHour} />
                    <Stat prefix="" className="green" title="Last week high" value={cviInfo?.periodHigh}/>
                    <Stat prefix="" className="red" title="Last week low" value={cviInfo?.periodLow}/>
                </div>
            </div>
        )
    }, [cviInfo?.periodHigh, cviInfo?.periodLow, cviInfo?.previousHour, type]) 
}

export default CviStats;