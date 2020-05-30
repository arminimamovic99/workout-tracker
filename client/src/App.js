import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 

const App = () => (
  <Router>
    <Fragment>
        <Navbar />
        <section className="container">
          <Switch>  
            <Route exact path="/register" component={ Register } />
            <Route exact path="/login" component={ Login } />
          </Switch>
        </section>
        <Route exact path="/" component={ Landing } />
    </Fragment>
  </Router>
)
    
export default App;
