import CountdownComponent, { useTimer } from 'components/Countdown/Countdown';
import arbitrageConfig from 'config/arbitrageConfig';
import React, { useEffect, useMemo, useState } from 'react'

export const twelveHours = 43200000;

const FulfillmentInTimer = ({ fulfillmentIn, actionType, setActionType }) => {
    const [_lockedTime, setLockTime] = useState(fulfillmentIn);
    useTimer({ timerDuration: _lockedTime, setTimerDuration: setLockTime, start: true, stopPoint: -twelveHours });

    useEffect(() => {
        if(-twelveHours >= _lockedTime) {
            setActionType(arbitrageConfig.actionsConfig.liquidate.key);
        }
    }, [_lockedTime, setActionType])

    return useMemo(() => {
        return <CountdownComponent 
                lockedTime={_lockedTime} 
                isExpired={_lockedTime >= -twelveHours}
                showIfZero 
                showSeconds
            />
    }, [_lockedTime]);
}

export default FulfillmentInTimer;