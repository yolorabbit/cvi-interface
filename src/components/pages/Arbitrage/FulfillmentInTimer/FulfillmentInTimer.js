import CountdownComponent, { twelveHours, useTimer } from 'components/Countdown/Countdown';
import React, { useMemo, useState } from 'react'

const FulfillmentInTimer = ({fulfillmentIn}) => {
    const [_lockedTime, setLockTime] = useState(fulfillmentIn);
    useTimer({ timerDuration: _lockedTime, setTimerDuration: setLockTime, start: true, stopPoint: -twelveHours });

    return useMemo(() => {
        return <CountdownComponent lockedTime={_lockedTime} showIfZero/>
    }, [_lockedTime]);
}

export default FulfillmentInTimer;