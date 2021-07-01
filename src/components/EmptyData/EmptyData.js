import React from 'react'
import './EmptyData.scss';

const EmptyData = ({text = "No data found."}) => {
    return (
        <div className="empty-data-component">
            <img src={require('images/icons/empty-search.svg').default} alt="empty" />
            <span>{text}</span>
        </div>
    )
}

export default EmptyData;