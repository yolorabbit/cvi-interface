import React from 'react'
import Value from './Value';

const Apy = ({apyList = [], limitedTimeApy}) => {
    const apys = ["Yearly", "Weekly", "Daily"];
    return <div className="apy-component">
      {limitedTimeApy && <a className='limited-time-apy' title="Limited time APY" href={limitedTimeApy} target="_blank" rel="nofollow noopener noreferrer">Limited time APY</a>}
      {apyList.map((apy, index) => <Value key={index} text={apy} subText={apys[index]} disableSpace />)}
    </div>
}

export default Apy;