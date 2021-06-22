import React from 'react'

export const Value = ({text, subText}) => {
    return (
        <div className="value-component">
            <b>{text} </b>
            <span>{subText}</span>
        </div>
    )
}
