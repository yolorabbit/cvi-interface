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
import Guides from './components/pages/Guides';
import About from './components/pages/About';
import Footer from './components/Footer/Footer';
import config from './config/config';

const App = () => {
  return (
    <div className="app-component">
      <Router>
        <Navbar />
          <Switch>
            <Route path={config.routes.staking.path} component={Staking} />
            <Route path={config.routes.guides.path} component={Guides} />
            <Route path={config.routes.about.path} component={About} />

            <Route path={ config.routes.platform.path} component={Platform} />

            <Redirect to="/platform" />
          </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
