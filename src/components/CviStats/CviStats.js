import React from 'react'
import './CviStats.scss';
import Stat from '../Stat';
import CviInfo from './CviInfo';

const CviStats = () => {
    return (
        <div className="cvi-stats-component">
            <div className="cvi-stats-component__container">
                <CviInfo />
                <Stat title="Previous hour" value="38.13" />
                <Stat prefix="" className="green" title="Last week high" value="42" />
                <Stat prefix="" className="green" title="Last week low" value="37.6" />
            </div>
        </div>
    )
}

export default CviStats;