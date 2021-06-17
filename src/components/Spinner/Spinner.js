import React from 'react'
import './Spinner.scss';

const Spinner = ({className, style, spinnerStyle}) => {
    return (
        <div className={`spinner-container ${className}`} style={style} > 
            <div className="spinner" style={spinnerStyle}> 
            </div>
        </div>
    )
}

export default Spinner
