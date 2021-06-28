import React from 'react'
import './Row.scss';

const Row = ({children, flex}) => {
    return (
        <div style={flex ? {flex} : {}} className="row-component">
            {children}
        </div>
    )
}

export default Row;