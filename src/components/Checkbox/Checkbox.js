import React from "react";
import "./Checkbox.scss";

const Checkbox = ({
  onClick,
  id,
  title,
  className,
  tooltip,
  checked,
  disabled,
}) => {
  return (
    <div className={`checkbox-component ${className ?? ''}`}>
      <input
        id={id}
        className="custom-checkbox"
        type="checkbox"
        disabled={disabled}
        onClick={onClick}
        defaultChecked={checked}
      />
      <label htmlFor={id}></label>
      <div className="checkbox-title">
        {title} {tooltip}
      </div>
    </div>
  );
};

export default Checkbox;
