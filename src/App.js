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
import { useEffect, useRef } from 'react';
import { ContractsContext } from 'contracts/ContractContext';
import { uniqueId } from 'lodash';
import { useSelector } from 'react-redux';

const App = () => {
  // fix a bug in Web3ReactProvider - render a text element ",". 
  const { selectedNetwork } = useSelector(({app}) => app);
  const appRef = useRef(null);

  useEffect(() => {
    if (appRef.current?.nextSibling?.textContent === ",") {
      appRef.current?.nextSibling.remove();
    }
  }, [appRef]);


  return (
    <div className="app-component" ref={appRef}>
      <NotificationList />
      <Web3ReactManager key={selectedNetwork}>
        <ContractsContext>
          <Router>
            <Navbar />
            <Switch>
              <Route path={config.routes.staking.path} component={Staking} />
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
