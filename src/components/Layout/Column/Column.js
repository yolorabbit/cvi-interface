import React from 'react'
import './Column.scss';

const Column = ({children}) => {
    return (
        <div className="column-component">
            {children}
        </div>
    )
}

export default Column;