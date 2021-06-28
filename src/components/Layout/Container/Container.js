import React from 'react'
import './Container.scss';

const Container = ({className, title, children}) => {
    return (
        <div className={`${className ?? ''} container-component`}>
            {title && <div className="container-component__header">
                <h2>{title}</h2>
            </div>}
            {children}
        </div>
    )
}

export default Container;