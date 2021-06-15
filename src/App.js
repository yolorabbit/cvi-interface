import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Platform from './components/pages/Platform';
import './App.scss';
import Staking from './components/pages/Staking';
import Guides from './components/pages/Guides';
import About from './components/pages/About';

const App = () => {
  return (
    <div className="app-component">
      <Navbar />
      <Router>
          <Switch>
            <Route path="/platform" component={Platform} />
            <Route path="/staking" component={Staking} />
            <Route path="/guides" component={Guides} />
            <Route path="/about" component={About} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
