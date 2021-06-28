import React from 'react'

const Value = ({text, subText, bottomText}) => {
    return (
        <div className="value-component">
            <b>{text} </b>
            <span>{subText}</span>
            {bottomText && <div>{bottomText}</div>}
        </div>
    )
}

export default Value;