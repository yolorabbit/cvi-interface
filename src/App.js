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
import './App.scss';
import { useEffect, useMemo, useRef } from 'react';
import { ContractsContext } from 'contracts/ContractContext';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga';

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


  const StakingMemo = useMemo(()=>Staking,[]);
  
  return (
    <div className="app-component" ref={appRef}>
      <NotificationList />
      <Web3ReactManager key={selectedNetwork}>
        <ContractsContext>
          <Router>
            <Navbar />
            <Switch>
              <Route path={config.routes.staking.path} component={StakingMemo} />
              <Route path={config.routes['help-center'].path} component={HelpCenter} />
              <Route path={config.routes.platform.path} component={Platform} />
              <Redirect to="/platform" />
            </Switch>
            <Footer />
          </Router>
        </ContractsContext>
      </Web3ReactManager>
    </div>
  );
}

export default App;
