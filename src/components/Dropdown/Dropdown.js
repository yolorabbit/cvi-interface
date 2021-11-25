import React, { useState } from "react";
import "./Dropdown.scss";

const Dropdown = ( {  label, type, initialValue, dropdownOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(initialValue);

  const dropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const dropdownSelection = (value) => {
    setDropdownValue(value);
    setIsOpen(false);
  };

  const valueChange = ({target: { value }}) => {
    if (value === '') return setDropdownValue(''); // Clear input
    if (type === "number" && (isNaN(Number(value)) || !dropdownOptions.includes(Number(value)))) return; // Only Numbers, Only if included in options
    setDropdownValue(value);
  };

  return (
    <div className={`dropdown-component${isOpen ? ' open' : ''}${(dropdownValue === '') ? ' error' : ''}`}>
      <div className="dropdown-group">
        <div className="input-group">
          <input type="text" placeholder={dropdownValue}
            className="dropdown-input"
            name="dropdown-input"
            autoComplete="off"
            value={dropdownValue}
            onChange={valueChange} />
          <img className="open-icon"
            src={require("../../images/icons/dropdown-chevron-orange.svg").default}
            alt="chevron"
            onClick={dropdownToggle} />
        </div>
        <div className="dropdown-label">{label}</div>
      </div>
      {isOpen && (
        <ul className="dropdown-component-open">
          {dropdownOptions.map((value, index) => {
            return (
              <li key={index}
                className={`dropdown-option${value === dropdownValue ? " selected" : "" }`}
                onClick={() => dropdownSelection(value)} >
                {value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
