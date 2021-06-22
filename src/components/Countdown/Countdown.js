import React from 'react'
import './Countdown.scss';

const Countdown = () => {
    return (
        <div className="count-down-component">
            <img src={require('../../images/icons/processing.svg').default} alt="processing" /> 
            <b> 08:43</b> 
            <small>HH:MM</small>
        </div>
    )
}

export default Countdown;