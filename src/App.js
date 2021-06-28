import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Platform from './components/pages/Platform';
import './App.scss';
import Staking from './components/pages/Staking';
import HelpCenter from './components/pages/HelpCenter';
import Footer from './components/Footer/Footer';
import config from './config/config';

const App = () => {
  return (
    <div className="app-component">
      <Router>
        <Navbar />
          <Switch>
            <Route path={config.routes.staking.path} component={Staking} />
            <Route path={config.routes['help-center'].path} component={HelpCenter} />
            <Route path={ config.routes.platform.path} component={Platform} />

            <Redirect to="/platform" />
          </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
