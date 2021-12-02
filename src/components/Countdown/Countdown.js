import { useActionController } from 'components/Actions/ActionController';
import { useInDOM } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useWeb3Api } from 'contracts/useWeb3Api';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getTimeDurationFormatted } from 'utils';
import './Countdown.scss';

export const twelveHours = 43200000;

export const useTimer = ({ timerDuration, setTimerDuration, start = true, stopPoint = 0, step = 1000}) => {
    const _lockedDurationTimer = useRef();
    const isActiveInDOM = useInDOM();
    useEffect(() => {
        if(timerDuration === null || timerDuration < stopPoint || !timerDuration || !start) return;
        _lockedDurationTimer.current = setTimeout(() => {
            if(isActiveInDOM()) { 
                setTimerDuration(prevTime => {
                    if(!prevTime) return;
                    if(timerDuration <= stopPoint) {
                        clearTimeout(_lockedDurationTimer.current);
                        return 0;
                    }
                    return prevTime - step
                });
            }
        }, 1000);

        return () => {
            if(_lockedDurationTimer.current) clearTimeout(_lockedDurationTimer.current);
        }
    }, [isActiveInDOM, setTimerDuration, start, step, stopPoint, timerDuration]);
}

export const useIsLockedTime = (start = true) => {
    const { account } = useActiveWeb3React();
    const { token, type } = useActionController();
    const isLockedOptionsPayload = useMemo(() => ({updateOn: type === "withdraw" ? 'liquidities' : 'positions'}), [type]);
    const isLockedPayload = useMemo(() => ({type, account, stopInitialCall: !start}), [type, account, start]);
    const [lockedData] = useWeb3Api("isLocked", token, isLockedPayload, isLockedOptionsPayload);
    const [_lockedTime, setLockTime] = useState(null);
    useTimer({timerDuration: _lockedTime, setTimerDuration: setLockTime, start });

    useEffect(() => {
        if(lockedData && lockedData !== "N/A" && start) {
            setLockTime(lockedData[1]);
        }
    }, [lockedData, start]);

    return _lockedTime;
}

export const CountdownComponent = ({ lockedTime, className, showIfZero }) => {
    return useMemo(() => {
        if(lockedTime === "N/A" || !lockedTime) return null;
        return <div className={`count-down-component ${className ?? ''}`}>
            {lockedTime && lockedTime > 0 ?
            <> 
                <img src={require('../../images/icons/processing.svg').default} alt="processing" /> 
                <b>{getTimeDurationFormatted(lockedTime)}</b> 
                <small>HH:MM</small>
            </>
            : (showIfZero && lockedTime < 0) ?
            (lockedTime > -twelveHours) ?
            <> 
                <img src={require('../../images/icons/processing-negative.svg').default} alt="processing" /> 
                <b>{getTimeDurationFormatted(lockedTime)}</b> 
                <small>HH:MM</small>
            </> :
            <> 
                <img src={require('../../images/icons/processing-expired.svg').default} alt="expired" /> 
                <b>Expired</b> 
            </>
            : null
            }  
        </div>
    }, [lockedTime, className, showIfZero])
}

export default CountdownComponent;