import { useIsTablet } from 'components/hooks';
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import config from '../../config/config';
import './Navbar.scss';
import Button from '../Elements/Button';

const Navbar = () => {
    const location = useLocation();
    const isTablet = useIsTablet();
    const [activePath, setActivePath] = useState();
    const links = Object.values(config.routes);
    
    useEffect(() => {
        setActivePath(location?.pathname);
    }, [location?.pathname]);

    return (
        <div className="navbar-component">
            <Logo />

            {!isTablet && links.map(({label, path}) => <div key={path} className="navbar-component__list">
                <Link className={path === activePath ? 'active' : ''} to={path}>{label}</Link>
            </div>)}    

            {isTablet && <Hamburger />}
        </div>
    )
}

const Hamburger = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <> 
            <Button className={`hamburger-component ${isOpen ? 'opened' : 'closed'}`} onClick={() => setIsOpen(!isOpen)} >
                <div className="hamburger-component__container">
                    <img src={require(`../../images/icons/${!isOpen ? 'menu-icon.svg' : 'close.svg'}`).default} alt="menu" />
                </div>
            </Button>
        </>
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