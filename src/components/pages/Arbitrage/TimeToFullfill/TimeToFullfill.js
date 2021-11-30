import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Stat from "components/Stat";
import { appViewContext } from "components/Context";
import { debounce, isNumber } from "lodash";
import Dropdown from "components/Dropdown/Dropdown";
import "./TimeToFullfill.scss";
import Spinner from "components/Spinner/Spinner";
import { customFixed } from "utils";

// show as time delay fee min and max.
// const timeDelayWindow = await w3?.tokens[activeToken.rel.contractKey].getTimeDelayWindow();
// console.log('timeDelayWindow: ', timeDelayWindow); {min/60 , max/60}

// calculate time delay fee 
// const timeDelayFee = await w3?.tokens[activeToken.rel.contractKey].calculateTimeDelayFee(1000)
// console.log("timeDelayFee: ", timeDelayFee);

// create mint request
// const submitMintRes = await w3?.tokens[activeToken.rel.contractKey].submitMint("10",account, 500);
// console.log("submitMintRes: ", submitMintRes);

// pending reqeusts -> store in reducer under mints
// const unfulfilledRequests = await w3?.tokens[activeToken.rel.contractKey].getUnfulfilledRequests({account});
// console.log("unfulfilledRequests: ", unfulfilledRequests);

const TimeToFullfill = ({delayFee, setDelayFee}) => {
  const { w3, activeToken } = useContext(appViewContext);
  const [hoursDropdownValue, setHoursDropdownValue] = useState("");
  const [minutesDropdownValue, setMinutesDropdownValue] = useState("");
  const [maxHours, setMaxHours] = useState();
  const [maxMinutes, setMaxMinutes] = useState();

  const getOptions = useCallback((minRange, maxRange) => {
    if(maxMinutes === 0 && maxHours === 0) return [];
    if((!minRange && minRange !== 0) || !maxRange) return [];
    return [...new Array(maxRange)].map((option, index) => index+minRange);
  }, [maxHours, maxMinutes]);

  const calculateTimeDelayFee = useCallback(async () => {
    let isValid = true;
    try {
      if(!hoursDropdownValue && !minutesDropdownValue) return;
      const totalTime = Number(hoursDropdownValue * 60 * 60) + Number(minutesDropdownValue * 60);
      if(totalTime < (maxMinutes * 60) || totalTime > (maxHours * 60 * 60)) return;
      const timeDelayFee = await w3?.tokens[activeToken.rel.contractKey].calculateTimeDelayFee(totalTime);
      setDelayFee(timeDelayFee);
    } catch (error) {
      isValid = false;
      console.log(error);
      setDelayFee("N/A");
    } finally {
      if(!isValid) setDelayFee("N/A");
    }
  }, [activeToken.rel.contractKey, hoursDropdownValue, maxHours, maxMinutes, minutesDropdownValue, setDelayFee, w3?.tokens]);

  const calculateTimeDelayFeeDebounce = useMemo(
    () => debounce(calculateTimeDelayFee, 750),
  [calculateTimeDelayFee]);

  useEffect(() => {
    if(!w3 || !w3.tokens) return; 

    const fetchData = async () => {
      try {
          const {maxTimeWindow, minTimeWindow} = await w3?.tokens[activeToken.rel.contractKey].getTimeDelayWindow();
          setMaxHours(maxTimeWindow ? (maxTimeWindow/60/60) : 0);
          setMaxMinutes(minTimeWindow ? (minTimeWindow/60) : 0);
      } catch (error) {
        console.log(error);
        setMaxHours("0");
        setMaxMinutes("0");
      }
    }

    const fetchDataDebounce = debounce(fetchData, 350);
    fetchDataDebounce();

    return () => {
      fetchDataDebounce.cancel();
    }
  }, [activeToken.rel.contractKey, calculateTimeDelayFeeDebounce, w3]);

  useEffect(() => {
    if(!isNumber(hoursDropdownValue) && !isNumber(!minutesDropdownValue)) {
      setHoursDropdownValue(maxHours || "0");
      return setMinutesDropdownValue("0");
    }

    setDelayFee(null);
    calculateTimeDelayFeeDebounce();

    if(Number(hoursDropdownValue) >= maxHours) return setMinutesDropdownValue("0");
    if(Number(hoursDropdownValue) === 0 && Number(minutesDropdownValue) < maxMinutes) return setMinutesDropdownValue(maxMinutes);

    return () => {
      calculateTimeDelayFeeDebounce.cancel();
    }
  }, [hoursDropdownValue, minutesDropdownValue, maxHours, maxMinutes, calculateTimeDelayFee, calculateTimeDelayFeeDebounce, setDelayFee]);

  return useMemo(() => {
    
    return (
      <div className="fullfill-wrapper">
        <h2>Time to fulfillment</h2>
        <BetweenText 
          maxMinutes={maxMinutes} 
          maxHours={maxHours} 
        />
        <div className="time-wrapper">
          <Dropdown
            type="number"
            label="hours"
            dropdownOptions={getOptions(maxMinutes >= 60 ? 1 : 0 , maxHours+1)}
            dropdownValue={hoursDropdownValue}
            setDropdownValue={setHoursDropdownValue}
          />
          <span>:</span>
          <Dropdown
            type="number"
            label="minutes"
            dropdownOptions={getOptions(hoursDropdownValue === 0 ? maxMinutes : 0, hoursDropdownValue === maxHours ? 0 : (61-maxMinutes))}
            dropdownValue={minutesDropdownValue}
            setDropdownValue={setMinutesDropdownValue}
          />
        </div>
        <div className="time-to-fulfill-fee">
          <Stat 
            className="row bold small-value"
            title="Time to fulfillment fee"
            value={delayFee === 'N/A' ? 'N/A' : delayFee === null ? null : `${customFixed(delayFee, 2)}%`}
          />
        </div>
      </div>
    );
  }, [delayFee, getOptions, hoursDropdownValue, maxHours, maxMinutes, minutesDropdownValue])
};

const BetweenText = ({maxMinutes, maxHours}) => {
  return useMemo(() => {
    if(!maxMinutes && !maxHours) return <span className="between-text">Between <Spinner className="statistics-spinner" /> hours to <Spinner className="statistics-spinner" /> hours.</span>
    return <span>(Between {maxMinutes < 60 ? `${maxMinutes} minutes` : `${maxMinutes / 60} hours`} to {maxHours} hours)</span>
  }, [maxHours, maxMinutes]);
}
export default TimeToFullfill;
