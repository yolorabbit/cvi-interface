import { useInDOM } from 'components/Hooks';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getTimeDurationFormatted } from 'utils';
import './Countdown.scss';

const useCountdown = () => {
    const [_lockedTime, _setLockedTime] = useState(10000);
    const _lockedDurationTimer = useRef();
    const isActiveInDOM = useInDOM();

    useEffect(() => {
        _lockedDurationTimer.current = setInterval(() => {
            if(isActiveInDOM()) { 
            _setLockedTime(prevTime => {
                if(!prevTime) return;
                return prevTime - 1000
            });
            }
        }, 1000);

        //eslint-disable-next-line
        return () => {
            if(_lockedDurationTimer.current) clearInterval(_lockedDurationTimer.current);
        }
        //eslint-disable-next-line
    }, []);

    const Cd = useMemo(() => {
        return <div className="count-down-component">
            {_lockedTime >= 0 ? <> 
                <img src={require('../../images/icons/processing.svg').default} alt="processing" /> 
                <b>{getTimeDurationFormatted(_lockedTime)}</b> 
                <small>HH:MM</small>
            </> : null }  
        </div>
    }, [_lockedTime]);

    return [_lockedTime, Cd]
}

export default useCountdown;