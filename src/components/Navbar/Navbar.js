import { useInDOM, useIsTablet } from "components/Hooks";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import config from "../../config/config";
import Button from "../Elements/Button";
import TotalValueLocked from "components/TotalValueLocked";
import SelectNetwork from "components/SelectNetwork";
import ConnectWallet from "components/ConnectWallet";
import "./Navbar.scss";
import { track } from "shared/analytics";

const Navbar = () => {
  const isActiveInDOM = useInDOM();
  const [pageYOffset, setPageYOffset] = useState(0);
  const location = useLocation();
  const isTablet = useIsTablet();
  const [activePath, setActivePath] = useState();
  const links = Object.values(config.routes);
  const from = location?.state?.from;
  const showEnterApp =
    activePath === "/help" ||
    links.some(
      ({ enterApp, path }) => enterApp && activePath && activePath === path
    ); // show "enter app button" if config match enterApp flag.

  const filteredLink = links.filter(
    ({ hide, path }) =>
      !hide?.some((hidePath) => {
        const isHidePath = !(hidePath && hidePath !== activePath); // hide current link by hiding list in routes (config.js)
        return (isHidePath && showEnterApp) || path === "/"; // always hide home page link
      })
  ); // don't show links who hided in config by active path and "show enter app" state

  useEffect(() => {
    if (isActiveInDOM()) setActivePath(location?.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setPageYOffset(window?.pageYOffset);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const RenderView = useMemo(() => {
    return (
      <>
        <Logo showEnterApp={showEnterApp} />
        {!isTablet && (
          <Links
            links={filteredLink}
            activePath={activePath}
            activeFrom={from}
          />
        )}
        {isTablet ? (
          <Hamburger
            links={filteredLink}
            activePath={activePath}
            showEnterApp={showEnterApp}
          />
        ) : (
          <AppButton showEnterApp={showEnterApp} />
        )}
      </>
    );
    //eslint-disable-next-line
  }, [showEnterApp, activePath, isTablet]);

  return useMemo(() => {
    return (
      <div
        className={`navbar-component ${showEnterApp ? "is-home" : ""} ${
          pageYOffset > 25 ? "is-scroll" : ""
        }`}
      >
        <div className="navbar-component__container">{RenderView}</div>
      </div>
    );
  }, [showEnterApp, pageYOffset, RenderView]);
};

export const EnterApp = ({ setIsOpen }) => {
  return useMemo(
    () => (
      <div className="navbar-component__container--connect">
        <Link
          to={config.routes.platform.path}
          className="navbar-component__container--connect-enter-app"
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          <div>ENTER PLATFORM</div>
        </Link>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

const AppButton = ({ showEnterApp, setIsOpen }) => {
  return useMemo(() => {
    if (showEnterApp) return <EnterApp setIsOpen={setIsOpen} />;

    return (
      <div className="navbar-component__container--connect">
        <TotalValueLocked placement="navbar" />
        <SelectNetwork />
        <NavbarConnectMemoized />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEnterApp]);
};

const Links = ({ links, activePath, activeFrom, setIsOpen }) => {
  return useMemo(() => {
    const generatePath = (path, prevLink) => {
      if (prevLink) {
        if (activeFrom) return activeFrom;
        return activePath === "/" ? "home" : activePath?.replace("/", "");
      }
      return path;
    };

    return links.map(({ label, path, external, prevLink }) => (
      <NavLink
        key={path}
        label={label}
        path={path}
        prevPath={generatePath(path, prevLink)}
        external={external}
        activePath={activePath}
        setIsOpen={setIsOpen}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links, activePath, activeFrom]);
};

const Hamburger = ({ links, activePath, showEnterApp }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="mobile-menu">
          <Links links={links} activePath={activePath} setIsOpen={setIsOpen} />

          <div className="navbar-component__list-item">
            <TotalValueLocked placement="navitem" />
          </div>

          {showEnterApp ? (
            <AppButton showEnterApp={showEnterApp} setIsOpen={setIsOpen} />
          ) : (
            <>
              <div className="navbar-component__list-item">
                <SelectNetwork />
              </div>

              <div className="navbar-component__list-item">
                <ConnectWallet
                  type="navbar"
                  buttonText="CONNECT"
                  hasErrorButtonText="Wrong network"
                />
              </div>
            </>
          )}
        </div>
      )}

      <Button
        className={`hamburger-component ${isOpen ? "opened" : "closed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="hamburger-component__container">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Button>
    </>
  );
};

const NavLink = ({
  label,
  path,
  external,
  activePath,
  prevPath,
  setIsOpen,
}) => {
  return useMemo(() => {
    const onClickLink = (path) => {
      window.scrollTo(0, 0);
      track(path);
      if (setIsOpen) setIsOpen(false);
    };

    return (
      <div key={path} className="navbar-component__list-item">
        {external ? (
          <a
            href={path}
            onClick={() => onClickLink(path)}
            rel="noopener noreferrer"
            target="_blank"
          >
            {label}
          </a>
        ) : (
          <Link
            className={
              typeof path === "string"
                ? path === activePath
                  ? "active"
                  : ""
                : path.includes(activePath)
                ? "active"
                : ""
            }
            to={{
              pathname: !path.toString().includes("help")
                ? path
                : activePath === "/" || activePath === "/help"
                ? "/help"
                : "/platform/help",
              state: { from: prevPath },
            }}
            onClick={() => onClickLink(path)}
          >
            {label}
          </Link>
        )}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, external, label, activePath, prevPath]);
};

const NavbarConnectMemoized = () => {
  return useMemo(
    () => (
      <ConnectWallet
        type="navbar"
        buttonText="CONNECT"
        hasErrorButtonText="Wrong network"
      />
    ),
    []
  );
};

export const Logo = ({ showEnterApp }) => {
  return useMemo(() => {
    const onClickLogo = () => {
      window.scrollTo(0, 0);
      track("CVI Logo");
    };

    return (
      <Link
        className="logo-component"
        to={
          showEnterApp ? config.routes.home.path : config.routes.platform.path
        }
        onClick={onClickLogo}
      >
        <img src={require("../../images/logo.svg").default} alt="logo" />
        <div>Crypto Volatility Index</div>
      </Link>
    );
  }, [showEnterApp]);
};

export default Navbar;
