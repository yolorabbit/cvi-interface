import { useIsTablet } from 'components/hooks';
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import config from '../../config/config';
import Button from '../Elements/Button';
import SelectNetwork from 'components/SelectNetwork';
import ConnectWallet from 'components/ConnectWallet';
import './Navbar.scss';

const Navbar = () => {
    const [pageYOffset, setPageYOffset] = useState(0);
    const location = useLocation();
    const isTablet = useIsTablet();
    const [activePath, setActivePath] = useState();
    const links = Object.values(config.routes);
    
    useEffect(() => {
        setActivePath(location?.pathname);
    }, [location?.pathname]);

    useEffect(() => {
        const onScroll = () => {
          setPageYOffset(window?.pageYOffset);
        }
        window.addEventListener('scroll', onScroll);
        return () => {
          window.removeEventListener('scroll', onScroll);
        } 
    }, []);
      

    const RenderView = useMemo(() => {
        return (
            <> 
                <Logo />

                {!isTablet && links.map(({label, path}) => <div key={path} className="navbar-component__list">
                    <Link className={path === activePath ? 'active' : ''} to={path}>{label}</Link>
                </div>)}    

                {isTablet ? <Hamburger activePath={activePath} links={links} /> : <div className="navbar-component__container--connect">
                    <SelectNetwork />
                    <ConnectWallet type="navbar" buttonText="CONNECT" hasErrorButtonText="Wrong network" />
                </div>}
            </>
        )
        //eslint-disable-next-line
    }, [activePath, isTablet]);

    return (
        <div className={`navbar-component ${pageYOffset > 25 ? 'is-scroll' : ''}`}>
          <div className="navbar-component__container">
            {RenderView}
          </div>
        </div>
    )
}

const Hamburger = ({links, activePath}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <> 
            {isOpen && <div className="mobile-menu">
                {links.map(({label, path}) => <div key={path} className="navbar-component__list">
                        <Link 
                            className={path === activePath ? 'active' : ''} 
                            to={path}
                            onClick={() => setIsOpen(false)}
                        >{label}</Link>
                </div>)}
            </div>}
            
            <Button className={`hamburger-component ${isOpen ? 'opened' : 'closed'}`} onClick={() => setIsOpen(!isOpen)} >
                <div className="hamburger-component__container">
                    <div></div>
                    <div></div>
                    <div></div>
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