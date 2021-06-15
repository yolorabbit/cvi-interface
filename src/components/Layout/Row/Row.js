import React from 'react'
import './Row.scss';

const Row = ({children}) => {
    return (
        <div className="row-component">
            {children}
        </div>
    )
}

export default Row;