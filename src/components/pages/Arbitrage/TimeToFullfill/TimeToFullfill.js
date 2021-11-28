import React from "react";
import "./TimeToFullfill.scss";
import Dropdown from "../../../Dropdown";
import Stat from "components/Stat";

const TimeToFullfill = () => {
  return (
    <div className="fullfill-wrapper">
      <h2>Time to fulfillment</h2>
      <span>(Between 1 to 3 hours)</span>
      <div className="time-wrapper">
        <Dropdown
          label="hours"
          dropdownOptions={[1, 2, 3]}
          initialValue={3}
          type="number"
        />
        <span>:</span>
        <Dropdown
          label="minutes"
          dropdownOptions={Array.from(Array(60).keys())}
          initialValue={0}
          type="number"
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
