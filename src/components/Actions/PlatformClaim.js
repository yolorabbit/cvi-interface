import Button from 'components/Elements/Button';
import { useEvents } from 'components/Hooks/useEvents';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import { DataState } from 'components/Tables/Elements/Values/DataState';
import { useWeb3Api } from 'contracts/useWeb3Api';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react'

const PlatformClaim = ({token}) => {
    const timerRef = useRef();
    const { library, account } = useActiveWeb3React();
    const accountPayload = useMemo(() => ({account}), [account]);
    const [claimData, updateClaimData] = useWeb3Api("getClaimData", token.key, accountPayload, {errorValue: "0", updateOn: "positions"});
    const { getLatestBlockTimestamp } = useEvents();
    const [processing, setProcessing] = useState(false);
    
    const { lastEndOfDay, lastEndDate, isClaimAvailable } = claimData?.[0] || {};

    const getDiff = async () => {
        try {
            const latestBlockTimestamp = await getLatestBlockTimestamp(library.eth.getBlock) * 1000;
            if(moment.utc(latestBlockTimestamp).isBefore(lastEndOfDay)) return moment.duration(lastEndOfDay.diff(moment.utc(latestBlockTimestamp))).asMilliseconds(); // before midnight, check duration to lastEndOfDay
            if(moment.utc(latestBlockTimestamp).isAfter(lastEndOfDay)) return moment.duration(lastEndDate.diff(moment.utc(latestBlockTimestamp))).asMilliseconds(); // after midnight, check duration to lastEndDate
        } catch(error) {
            console.log(error);
            return 0;
        }
    }

    const setUpdateClaimAvailableTimer = async () => {
        try {
            const latestBlockTimestamp = await getLatestBlockTimestamp(library.eth.getBlock) * 1000;
            if(moment.utc(latestBlockTimestamp).isAfter(lastEndDate)) return // 30 days passed from last open position
            const diffAsMilliseconds = Math.ceil(await getDiff());
            if(!diffAsMilliseconds) return;
            const oneHour = 1000 * 60 * 60;
            timerRef.current = setTimeout(() => {
                if(timerRef.current) clearTimeout(timerRef.current);
                updateClaimData();
            }, diffAsMilliseconds > oneHour ? oneHour : diffAsMilliseconds );
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(!library?.eth?.getBlock) return;
        setUpdateClaimAvailableTimer();

        return () => {
            if(timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        //eslint-disable-next-line
    }, [library?.eth?.getBlock]);


    return (
        <div className={`claim-component ${!isClaimAvailable ? 'is-not-available' : ''}`}>
            <DataState value={claimData}>
                {claimData?.map((claim, index) => <React.Fragment key={index}> 
                    <b>{claim.amount}</b>
                    <span>&nbsp;{claim.symbol} ({claim.totalAmount} {claim.symbol}) </span>
                    <Button 
                        className="claim-button" 
                        buttonText="Claim" 
                        eventOnSubmit
                        onClick={() => {}} 
                        processing={processing} 
                        disabled={processing || !isClaimAvailable}
                    /> 
                </React.Fragment>)}
            </DataState>
        </div>
    )
}

export default PlatformClaim;