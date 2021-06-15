import React from 'react'
import './Layout.scss';

const Layout = ({children}) => {
    return (
        <div className="layout-component">
            {children}
        </div>
    )
}

export default Layout;