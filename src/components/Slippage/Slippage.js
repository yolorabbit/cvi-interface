import React, { useCallback, useMemo, useState } from "react";
import Tooltip from "components/Tooltip";
import config from '../../config/config';
import "./Slippage.scss";
import { customFixed } from 'utils';

const Slippage = ({slippageTolerance, setSlippageTolerance}) => {
  const [costumTolerance, setCostumTolerance] = useState("");
  
  const slippageButtons = useMemo(() => ({
    buttons: ["0.5", "1", "2"],
  }), []);

  const slippageBtnHandler = useCallback((val) => {
    if (slippageTolerance !== val) {
      setSlippageTolerance(val);
    } else {
      setCostumTolerance("")
    }
  }, [setSlippageTolerance, slippageTolerance]);

  const customSlippageInput = ({target: { value }}) => {
    //eslint-disable-next-line
      var numbersOnly = /[^0-9][\.,]/g;
      let valNoLetters = value?.replace(numbersOnly, '');
      if (valNoLetters >= 0 && valNoLetters < 100) {
        let costumTolerance = valNoLetters
        setCostumTolerance(customFixed(costumTolerance, 2));
        slippageBtnHandler(customFixed(costumTolerance, 2));
      }
  }

  const isOtherOption = slippageButtons.buttons.includes(slippageTolerance);
  const isCustomSelected = !!costumTolerance && !isOtherOption;

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

        <div className={`input-container${isCustomSelected ? " selected" : ""}`}>
          <input type="text"
            placeholder="Custom"
            name="slippage-input"
            autoComplete="off"
            className="slippage-input"
            value={costumTolerance}
            onChange={customSlippageInput}
            onClick={() => {
              setSlippageTolerance("");
              setCostumTolerance("");
            }}
          />
          <span className="slippage-sign">%</span>
        </div>
      </div>
      {slippageTolerance && ((Number(slippageTolerance) < 0.5) || (Number(slippageTolerance) > 100)) &&
        <span className="slippage-error">
          <b>Pay Attention:</b> Your transaction may fail
        </span>
      }
    </div>
  );
};

export default Slippage;
