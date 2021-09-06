import { EnterApp } from 'components/Navbar/Navbar';
import React, { useMemo } from 'react';
import './Header.scss';

const Header = () => {
    return useMemo(() => {
        return (
            <div className="header-component">
                <div className="header-component__container">
                    <h1>Crypto Volatility Index</h1>
                    <p>
                        Crypto Volatility Index (CVI) is the first-of-its-kind decentralized Crypto Volatility Index for the crypto market. Among the use cases, it allows users to hedge themselves against market volatility and impermanent loss. <br/> <br/>
                        It is created by computing a decentralized volatility index from cryptocurrency option prices, together with analyzing the market’s expectation of future volatility. <br/> <br/>
                        The Crypto Volatility Index (CVI) is a decentralized VIX for crypto, built on Ethereum and Polygon. Among the use cases, it allows users to hedge themselves against market volatility and impermanent loss. 
                    </p>
                    <EnterApp />
                </div>
            </div>
        )
    }, []);
}

export default Header;