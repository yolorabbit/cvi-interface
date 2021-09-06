import { useInDOM, useIsTablet } from 'components/Hooks';
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import config from '../../config/config';
import Button from '../Elements/Button';
import SelectNetwork from 'components/SelectNetwork';
import ConnectWallet from 'components/ConnectWallet';
import './Navbar.scss';
import { track } from 'shared/analytics';

const Navbar = () => {
    const isActiveInDOM = useInDOM();
    const [pageYOffset, setPageYOffset] = useState(0);
    const location = useLocation();
    const isTablet = useIsTablet();
    const [activePath, setActivePath] = useState();
    const links = Object.values(config.routes);
    const filteredLink = links.filter(({hide}) => !hide?.some(path => !(path && path !== activePath)));
    const showEnterApp = links.some(({enterApp, path}) => (enterApp && activePath) && activePath === path);

    useEffect(() => {
        if(isActiveInDOM()) setActivePath(location?.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                {!isTablet && <Links links={filteredLink} activePath={activePath} /> }
                {isTablet ? <Hamburger links={filteredLink} activePath={activePath} showEnterApp={showEnterApp} /> : <AppButton showEnterApp={showEnterApp} />}
            </>
        )
        //eslint-disable-next-line
    }, [showEnterApp, activePath, isTablet]);

    return useMemo(() => {
        return (
            <div className={`navbar-component ${showEnterApp ? 'is-home' : ''} ${pageYOffset > 25 ? 'is-scroll' : ''}`}>
              <div className="navbar-component__container">
                {RenderView}
              </div>
            </div>
        )
    }, [showEnterApp, pageYOffset, RenderView]) 
}

export const EnterApp = () => {
    return useMemo(() => <div className="navbar-component__container--connect">
        <Link to={config.routes.platform.path} className="navbar-component__container--connect-enter-app">
            <div>
                ENTER APP
            </div>
        </Link>
    </div>, []);
}

const AppButton = ({showEnterApp}) => {
    return useMemo(() => {
        if(showEnterApp) return <EnterApp />

        return <div className="navbar-component__container--connect">
            <SelectNetwork />
            <NavbarConnectMemoized />
        </div>
    }, [showEnterApp]);
}

const Links = ({links, activePath}) => {
    return useMemo(() => links.map(({label, path, external}) => <NavLink key={path} label={label} path={path} external={external} activePath={activePath} />), [links, activePath])
}

const Hamburger = ({links, activePath, showEnterApp}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <> 
            {isOpen && <div className="mobile-menu">
                {links
                    .filter(({hide}) => !hide?.some(path => activePath === path)) // use for hiding link by hide paths list config.
                    .map(({label, path, external}) => <NavLink key={path} label={label} path={path} external={external} activePath={activePath} setIsOpen={setIsOpen} />)}
                
                {showEnterApp ? <AppButton showEnterApp={showEnterApp} /> : <> 
                    <div className="navbar-component__list-item">
                        <SelectNetwork />
                    </div>

                    <div className="navbar-component__list-item">
                        <ConnectWallet type="navbar" buttonText="CONNECT" hasErrorButtonText="Wrong network" />
                    </div>
                </>}
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

const NavLink = ({label, path, external, activePath, setIsOpen}) => {
    return useMemo(() => {
        const onClickLink = (path) => {
            window.scrollTo(0, 0);
            track(path);

            if(setIsOpen) setIsOpen(false);
        }
        
        return <div key={path} className="navbar-component__list-item">
            {external ? <a href={path} onClick={() => onClickLink(path)} rel="noopener noreferrer" target="_blank">
                {label}
            </a> : <Link 
                className={path === activePath ? 'active' : ''} 
                to={path} 
                onClick={() => onClickLink(path)}
            >
                {label}
            </Link>}
        </div>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, external, label, activePath]);
}

const NavbarConnectMemoized = () => {
    return useMemo(() => <ConnectWallet type="navbar" buttonText="CONNECT" hasErrorButtonText="Wrong network" />, []);
}


export const Logo = () => {
    return useMemo(() => {
        const onClickLogo = () => {
            window.scrollTo(0, 0);
            track('CVI Logo');
        }
    
        return <Link className="logo-component" to="/" onClick={onClickLogo}>
            <img src={require('../../images/logo.svg').default} alt="logo" />
            <div>Crypto Volatility Index</div>
        </Link>
    }, []);
}

export default Navbar;