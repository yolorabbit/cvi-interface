import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../../config/config';
import './Navbar.scss';

const Navbar = () => {
    const [activePath, setActivePath] = useState(config.routes.platform.path);
    const links = Object.values(config.routes);

    return (
        <div className="navbar-component">
            <Logo />

            {links.map(({label, path}) => <div key={path} className="navbar-component__list">
                <Link className={path === activePath ? 'active' : ''} to={path} onClick={() => setActivePath(path)}>{label}</Link>
            </div>)}    
        </div>
    )
}

export const Logo = () => {
    return useMemo(() => {
        return <Link className="logo-component" to="/">
            <img src={require('../../images/logo.svg').default} alt="logo" />
            <div>Crypto Volatility Index</div>
        </Link>
    }, []);
}

export default Navbar;