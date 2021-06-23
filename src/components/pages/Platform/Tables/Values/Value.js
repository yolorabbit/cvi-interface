import React from 'react'

const Value = ({text, subText}) => {
    return (
        <div className="value-component">
            <b>{text} </b>
            <span>{subText}</span>
        </div>
    )
}

export default Value;