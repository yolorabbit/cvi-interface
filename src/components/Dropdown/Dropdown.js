import React, { useCallback, useMemo, useState } from "react";
import "./Dropdown.scss";

const Dropdown = ({ label, type, initialValue, dropdownOptions, prefix }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(initialValue);

  const dropdownToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const valueChange = useCallback(
    ({ target: { value } }) => {
      if (value === "") return setDropdownValue(""); // Clear input
      if (
        type === "number" &&
        (isNaN(Number(value)) || !dropdownOptions.includes(Number(value)))
      )
        return; // Only Numbers, Only if included in options
      setDropdownValue(value);
    },
    [dropdownOptions, type]
  );

  return useMemo(() => {
    const dropdownSelection = (value) => {
      setDropdownValue(value);
      setIsOpen(false);
    };

    return (
      <div
        className={`dropdown-component${isOpen ? " open" : ""}${dropdownValue === "" ? " error" : ""}`}>
        <div className="dropdown-group">
          <div className="input-group">
            <input
              type="text"
              className="dropdown-input"
              name="dropdown-input"
              value={dropdownValue}
              onChange={valueChange}
            />

            <img
              className="open-icon"
              src={require("../../images/icons/dropdown-chevron-orange.svg").default}
              alt="chevron"
              onClick={dropdownToggle}
            />
          </div>

          <div className="dropdown-label">{label}</div>
        </div>
        {isOpen && (
          <ul className="dropdown-component-open">
            {dropdownOptions.map((value, index) => {
              return (
                <li
                  key={index}
                  className={`dropdown-option${value === dropdownValue ? " selected" : ""}`}
                  onClick={() => dropdownSelection(value)}
                >
                  {value}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }, [ label, dropdownOptions, dropdownValue, isOpen, dropdownToggle, valueChange ]);
};

export default Dropdown;
