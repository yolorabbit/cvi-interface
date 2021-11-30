import React, { useEffect, useState } from "react";
import "./TimeToFullfill.scss";
import Dropdown from "../../../Dropdown";
import Stat from "components/Stat";

const TimeToFullfill = () => {
  const maxHours = 3;
  
  const [hoursDropdownValue, setHoursDropdownValue] = useState();
  const [minutesDropdownValue, setMinutesDropdownValue] = useState();

  useEffect(() => {
    if(!hoursDropdownValue && !minutesDropdownValue) {
      setHoursDropdownValue("3");
      return setMinutesDropdownValue("0")
    }

    if(Number(hoursDropdownValue) >= maxHours) return setMinutesDropdownValue("0");

  }, [hoursDropdownValue, minutesDropdownValue]);

  return (
    <div className="fullfill-wrapper">
      <h2>Time to fulfillment</h2>
      <span>(Between 1 to 3 hours)</span>
      <div className="time-wrapper">
        <Dropdown
          type="number"
          label="hours"
          dropdownOptions={[1, 2, 3]}
          dropdownValue={hoursDropdownValue}
          setDropdownValue={setHoursDropdownValue}
        />
        <span>:</span>
        <Dropdown
          type="number"
          label="minutes"
          isInvalid={Number(hoursDropdownValue) >= maxHours}
          dropdownOptions={Array.from(Array(60).keys())}
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
