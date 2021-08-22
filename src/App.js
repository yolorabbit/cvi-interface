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
import { useDispatch, useSelector } from 'react-redux';
import ReactGA from 'react-ga';
import useSubscribe from 'components/Hooks/subscribe/useSubscribe';
import Modal from 'components/Modal';
import { setCviInfo } from 'store/actions';
import useCvi from 'components/Hooks/Cvi';
import axios from 'axios';

const App = () => {
  const { selectedNetwork } = useSelector(({app}) => app);
  const { status } = useSelector(({app}) => app.cviInfo);
  const appRef = useRef(null);
  const dispatch = useDispatch();

  // TODO: remove it after taking staging useCvi updates.
  const checkRestrictedCountry = async () => {
    try {
       const latestCviResponse = await axios.get('https://api-v2.cvi.finance/latest', {
          headers: {
             'Content-Type': 'application/json',
             'cache-control': 'no-cache',
          }
       });
 
       if(latestCviResponse.data?.status === 'Failure') {
          dispatch(setCviInfo({
             status: "Failure"
          }));
       }
    } catch(error) {
       console.log(error);
    }
 }

  useEffect(() => {
      checkRestrictedCountry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const closeModal = () => {
    dispatch(setCviInfo({
      status: null
    }));
  }
  
  return useMemo(() => (
    <>
      {status === "Failure" && <Modal className="restricted-modal" clickOutsideDisabled closeIcon handleCloseModal={closeModal}>
        <img src={require('./images/icons/notice-red-icon.svg').default} alt="warning" />
        <p>Access denied</p>
      </Modal>}
      
      <div className={`app-component ${status}`} ref={appRef}>
        <NotificationList />
        <Web3ReactManager key={selectedNetwork}>
          <ContractsContext>
            <Routes />
          </ContractsContext>
        </Web3ReactManager>
      </div>
    </>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [selectedNetwork, status]) 
}

export default App;


const Routes = () => {
  useSubscribe();
  useCvi();

  return useMemo(() => {
    return <> 
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
     </>
  }, [])
}