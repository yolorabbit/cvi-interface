import React, { useState } from "react";
import Tooltip from "components/Tooltip";
import "./Slippage.scss";
import config from '../../config/config';

const Slippage = () => {
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [costumTolerance, setCostumTolerance] = useState(0);

  const slippageButtons = {
    buttons: [0.5, 1, 2],
  };

  const slippageBtnHandler = (val) => {
    if (slippageTolerance !== val) {
      setSlippageTolerance(val);
    }
  };


  const customSlippageInput = (e) => {
      var numbersOnly = /[^0-9][\.,]/g;
      var val = e.target.value
      let valNoLetters = val.replace(numbersOnly, '');
      if (valNoLetters >= 0 && valNoLetters <= 100) {
        let costumTolerance = valNoLetters
        setCostumTolerance(costumTolerance)
        slippageBtnHandler(costumTolerance)
      }
  }

  return (
    <div className="slippage-component">
      <span className="slippage-title">
        {config.statisticsDetails.slippageTolerance.title}
        <Tooltip
          type="question"
          left={config.statisticsDetails.slippageTolerance.tooltip?.left ?? -30}
          mobileLeft={config.statisticsDetails.slippageTolerance.tooltip?.mobileLeft}
          maxWidth={400}
          minWidth={250}
          content={config.statisticsDetails.slippageTolerance.tooltip?.content}
        />
      </span>

      <div className="slippage-buttons-group">
        {slippageButtons.buttons &&
          slippageButtons.buttons.map((slippageValue, valnum) => {
            return (
              <button
                key={`${valnum}-${slippageValue}`}
                type="button"
                className={`slippage-button ${slippageValue === slippageTolerance ? " selected" : ""}`}
                onClick={() => slippageBtnHandler(slippageValue)}>
                <span>{slippageValue}%</span>
              </button>
            );
          })}

        <div className="input-container">
          <input type="text"
            placeholder="Custom"
            name="slippage-input"
            autoComplete="off"
            className="slippage-input"
            value={costumTolerance}
            onChange={customSlippageInput}/>
          <span className="slippage-sign">%</span>
        </div>
      </div>
      {slippageTolerance &&
      slippageTolerance < 0.5 &&
        <span className="slippage-error">
          <b>Pay Attention:</b> Your transaction may fail
          </span>
      }
    </div>
  );
};

export default Slippage;
