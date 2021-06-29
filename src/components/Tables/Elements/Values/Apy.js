import React from 'react'
import Value from './Value';

const Apy = ({apyList = []}) => {
    const apys = ["Daily", "Weekly", "Yearly"];
    return <div className="apy-component">
      {apyList.map((apy, index) => <Value key={index} text={apy} subText={apys[index]} />)}
    </div>
}

export default Apy;