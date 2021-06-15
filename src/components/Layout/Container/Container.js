import React from 'react'
import './Container.scss';

const Container = ({className, children}) => {
    return (
        <div className={`${className ?? ''} container-component`}>
            {children}
        </div>
    )
}

export default Container;