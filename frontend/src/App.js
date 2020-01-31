import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'typeface-roboto'
import { HeaderBar }  from './HeaderBar'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {
  return (
      <Router>
          <Switch>
              <Route path="/register">
                  <h1> Register </h1>
              </Route>
              <Route path="/login">
                  <h1> Login </h1>
              </Route>
              <Route path="/">
                  <React.Fragment>
                      <HeaderBar auth={false}/>
                      <h1> Place Holder</h1>
                  </React.Fragment>
              </Route>
          </Switch>
      </Router>
  );
}

export default App;
