import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Platform from './components/pages/Platform';
import Staking from './components/pages/Staking';
import HelpCenter from './components/pages/HelpCenter';
import Footer from './components/Footer/Footer';
import config from './config/config';
import NotificationList from 'components/NotificationList';
import Web3ReactManager from 'components/Web3ReactManager';
import { useEffect, useMemo, useRef } from 'react';
import { ContractsContext } from 'contracts/ContractContext';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga';
import useSubscribe from 'components/Hooks/subscribe/useSubscribe';
import Home from 'components/pages/Home';
import RestrictedModal from 'components/Modals/RestrictedModal';
import './App.scss';

const App = () => {
  const { selectedNetwork } = useSelector(({app}) => app);
  const appRef = useRef(null);

  useEffect(() => {
    // fix a bug in Web3ReactProvider - render a text element ",". 
    if (appRef.current?.nextSibling?.textContent === ",") {
      setTimeout(() => {
        appRef.current?.nextSibling.remove();
      }, 1000)
    }
  }, [appRef]);

  useEffect(() => {
    const initializeGA = () => {
      if(config.isMainnet) {
        ReactGA.initialize('UA-108807921-18'); // mainnet
      } else {
        ReactGA.initialize('UA-108807921-17');  // testnet
      }
    }

    initializeGA();
  }, []);

  return useMemo(() => (
    <>
      <div className="app-component" ref={appRef}>
        <NotificationList />
        <Web3ReactManager key={selectedNetwork}>
          <ContractsContext>
            <Routes />
          </ContractsContext>
        </Web3ReactManager>
      </div>
    </>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [selectedNetwork]) 
}

export default App;


const Routes = () => {
  useSubscribe();
 
  return useMemo(() => {
    return <> 
      <Router>
        <Navbar />
        <RestrictedModal />
        <Switch>
          <Route path={config.routes.staking.path} component={Staking} />
          <Route path={config.routes['help-center'].path} component={HelpCenter} />
          <Route path={config.routes.platform.path} component={Platform} />
          <Route path={config.routes.home.path} component={Home} />
          <Redirect to="/" />
        </Switch>
        <Footer />
      </Router>
     </>
  }, [])
}