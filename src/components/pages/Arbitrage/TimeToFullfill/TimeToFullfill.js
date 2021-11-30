import React, { useContext, useEffect, useState } from "react";
import Stat from "components/Stat";
import { appViewContext } from "components/Context";
import { delay, isNumber } from "lodash";
import Dropdown from "components/Dropdown/Dropdown";
import "./TimeToFullfill.scss";

const TimeToFullfill = () => {
  const [hoursDropdownValue, setHoursDropdownValue] = useState("");
  const [minutesDropdownValue, setMinutesDropdownValue] = useState("");
  const { w3, activeToken } = useContext(appViewContext);
  const [maxHours, setMaxHours] = useState();
  const [maxMinutes, setMaxMinutes] = useState();

  const getOptions = (minRange, maxRange) => {
    if((!minRange && minRange !== 0) || !maxRange) return [];
    return [...new Array(maxRange)].map((option, index) => index+minRange);
  }

  useEffect(() => {
    if(!w3 || !w3.tokens) return; 

    const fetchData = async () => {
      try {
          // show as time delay fee min and max.
          const {maxTimeWindow, minTimeWindow} = await w3?.tokens[activeToken.rel.contractKey].getTimeDelayWindow();
          setMaxHours(maxTimeWindow ? (maxTimeWindow/60/60) : 0);
          setMaxMinutes(minTimeWindow ? (minTimeWindow/60) : 0);
      } catch (error) {
        console.log(error);
        setMaxHours("0");
        setMaxMinutes("0");
      }
    }

    delay(() => fetchData(), 350);

  }, [activeToken.rel.contractKey, w3]);

  useEffect(() => {
    if(!isNumber(hoursDropdownValue) && !isNumber(!minutesDropdownValue)) {
      setHoursDropdownValue(maxHours || "0");
      return setMinutesDropdownValue("0");
    }

    if(Number(hoursDropdownValue) >= maxHours) return setMinutesDropdownValue("0");
    if(Number(hoursDropdownValue) === 0 && Number(minutesDropdownValue) < maxMinutes) return setMinutesDropdownValue(maxMinutes);

  }, [hoursDropdownValue, maxHours, maxMinutes, minutesDropdownValue]);

  return (
    <div className="fullfill-wrapper">
      <h2>Time to fulfillment</h2>
      <span>(Between {maxMinutes < 60 ? `${maxMinutes} minutes` : `${maxMinutes / 60} hours`} to {maxHours} hours)</span>
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
          value="1"
          format="1%"
        />
      </div>
    </div>
  );
};

export default TimeToFullfill;
