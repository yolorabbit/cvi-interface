import React, { useState } from "react";
import "./Dropdown.scss";

const Dropdown = () => {
  const [dropdownValue, setDropdownValue] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownLabel = "hours";
  const dropdownValues = [1, 2, 3];

  const dropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const dropdownSelection = (value) => {
    setDropdownValue(value);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-component${isOpen ? " open" : ""}`}>
      <div className="dropdown-group">
        <div className="input-group">
          <input type="text"
            placeholder={dropdownValue}
            name="dropdown-input"
            autoComplete="off"
            className="dropdown-input"
            value={dropdownValue} />
          <img className="open-icon"
            src={require("../../images/icons/dropdown-chevron-orange.svg").default}
            alt="chevron"
            onClick={dropdownToggle} />
        </div>
        <div className="dropdown-label">{dropdownLabel}</div>
      </div>
      {isOpen && (
        <ul className="dropdown-component-open">
          {dropdownValues.map((value, index) => {
            return (
              <li key={index}
                className={`dropdown-option${
                value === dropdownValue ? " selected" : ""}`}
                onClick={() => dropdownSelection(value)}>
                {value}
              </li>
            );
          })}
        </ul>
      )}
      ;
    </div>
  );
};

export default Dropdown;
