import React, { useState, useEffect } from "react";
import "./TotalValueLocked.scss";
import Tooltip from "components/Tooltip";
import { commaFormatted } from "../../utils";
import Api from "../../Api";

const TotalValueLocked = ({ placement }) => {
  const [tvlValue, setTvlValue] = useState(0);

  useEffect(() => {
    fetchTVL();
    return () => {
      setTvlValue();
    };
  }, []);

  async function fetchTVL() {
    try {
      const response = await Api.GET_TVL();
      const tvlAll = response.data.allTVL;
      setTvlValue(tvlAll);
    } catch (err) {
      console.log("Error in fetchTVL", err);
    }
  }

  const tvl = {
    headline: "Total value locked",
    shortHeadline: "TVL",
    value: tvlValue ? tvlValue : 0,
    tooltip: {
      content:
        "Total value locked is the sum of open positions, liquidity, and staked GOVI and LP tokens on both Ethereum and Polygon platforms",
      mobileLeft: 0,
      left: 0,
    },
  };

  return (
    <div className={`total-value-locked ${placement}`}>
      <h2>
        {placement === "navitem" ? tvl.shortHeadline : tvl.headline}
        {tvl.tooltip && placement !== "home" && (
          <Tooltip
            type="question"
            left={tvl.tooltip?.left ?? -30}
            mobileLeft={tvl.tooltip?.mobileLeft}
            maxWidth={"fit-content"}
            minWidth={250}
            content={tvl.tooltip?.content}
          />
        )}
      </h2>
      <p className="bold green">{commaFormatted(tvl.value)}</p>
    </div>
  );
};

export default TotalValueLocked;
