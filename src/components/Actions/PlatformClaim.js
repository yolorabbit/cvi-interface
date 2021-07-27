import Button from 'components/Elements/Button';
import { useEvents } from 'components/Hooks/useEvents';
import { useActiveWeb3React } from 'components/Hooks/wallet';
import Spinner from 'components/Spinner/Spinner';
import Rewards from 'components/Tables/Elements/Values/Rewards';
import config from 'config/config';
import { contractsContext } from 'contracts/ContractContext';
import { useWeb3Api } from 'contracts/useWeb3Api';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { addAlert } from 'store/actions';
import { actionConfirmEvent, gas } from 'utils';

const PlatformClaim = ({token}) => {
    const dispatch = useDispatch();
    const timerRef = useRef();
    const contracts = useContext(contractsContext);
    const { library, account } = useActiveWeb3React();
    const accountPayload = useMemo(() => ({account}), [account]);
    const [claimData, updateClaimData] = useWeb3Api("getClaimData", token.key, accountPayload, {updateOn: "positions"});
    const { getLatestBlockTimestamp } = useEvents();
    const [processing, setProcessing] = useState(false);
    const { lastEndOfDay, lastEndDate, isClaimAvailable, claimableRewards } = claimData?.[0] || {};
    
    const getDiff = async () => {
        try {
            if(lastEndDate === undefined || lastEndOfDay === undefined) return 0;
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

    const onSubmit = async () => {
        try {
            if(!claimData?.length > 0) return;
           
            await contracts[token.rel.positionRewards].methods.claimReward().send({ from: account, ...gas })

            dispatch(addAlert({
                id: 'claim',
                eventName: "claim positions - success",
                alertType: config.alerts.types.CONFIRMED,
                message: "Transaction success!"
            }));

            await updateClaimData();

            actionConfirmEvent(dispatch);
        } catch(error) {
            console.log(error);
            dispatch(addAlert({
                id: 'claim',
                eventName: "claim positions - failed",
                alertType: config.alerts.types.FAILED,
                message: "Transaction failed"
            }));
        } finally {
            setProcessing(false);
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
        <div className={`claim-component-platform ${(!isClaimAvailable || claimableRewards === "0") ? 'is-not-available' : ''}`}>
            {claimData === null ? <Spinner className="statistics-spinner claim-spinner" /> : <div className="claim-component-platform__container">
                <Rewards rewards={claimData} type="platform" />
                <Button 
                    className="claim-button" 
                    buttonText="Claim" 
                    onClick={onSubmit} 
                    processing={processing} 
                    disabled={processing || !isClaimAvailable || claimableRewards === "0"}
                /> 
            </div>}
        </div>
    )
}

export default PlatformClaim;