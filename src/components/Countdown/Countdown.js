import { useActionController } from 'components/Actions/ActionController';
import { useInDOM } from 'components/Hooks';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { useWeb3Api } from 'contracts/useWeb3Api';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getTimeDurationFormatted } from 'utils';
import './Countdown.scss';

export const useIsLockedTime = (start = true) => {
    const { account } = useActiveWeb3React();
    const { token, type } = useActionController();
    const isLockedOptionsPayload = useMemo(() => ({updateOn: type === "withdraw" ? 'liquidities' : 'positions'}), [type]);
    const isLockedPayload = useMemo(() => ({type, account, stopInitialCall: !start}), [type, account, start]);
    const [lockedData] = useWeb3Api("isLocked", token, isLockedPayload, isLockedOptionsPayload);
    const [_lockedTime, _setLockedTime] = useState(null);
    const _lockedDurationTimer = useRef();
    const isActiveInDOM = useInDOM();

    useEffect(() => {
        if(lockedData && lockedData !== "N/A" && start) {
            _setLockedTime(lockedData[1]);
        }
    }, [lockedData, start]);

    useEffect(() => {
        if(_lockedTime === null || _lockedTime < 0 || !_lockedTime || !start) return;
        _lockedDurationTimer.current = setTimeout(() => {
            if(isActiveInDOM()) { 
                _setLockedTime(prevTime => {
                    if(!prevTime) return;
                    if(_lockedTime <= 0) {
                        clearTimeout(_lockedDurationTimer.current);
                        return 0;
                    }
                    return prevTime - 1000
                });
            }
        }, 1000);

        //eslint-disable-next-line
        return () => {
            if(_lockedDurationTimer.current) clearTimeout(_lockedDurationTimer.current);
        }
        //eslint-disable-next-line
    }, [_lockedTime]);

    return _lockedTime;
}

export const CountdownComponent = ({ lockedTime, className }) => {
    return useMemo(() => {
        if(lockedTime === "N/A" || !lockedTime) return null;
        return <div className={`count-down-component ${className ?? ''}`}>
            {lockedTime && lockedTime > 0 ? <> 
                <img src={require('../../images/icons/processing.svg').default} alt="processing" /> 
                <b>{getTimeDurationFormatted(lockedTime)}</b> 
                <small>HH:MM</small>
            </> : null }  
        </div>
    }, [lockedTime, className])
}

export default CountdownComponent;