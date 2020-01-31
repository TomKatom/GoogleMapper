import React, {Component, useState, useEffect} from 'react';
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
import CircularProgress from "@material-ui/core/CircularProgress";


function App() {
    const [authed, setAuth] = useState(false);
    const [isAuthorized, setAuthorized] = useState(false);
    useEffect(() => {
        fetch('http://localhost:5000/auth', {
            credentials: "include",
            method: "GET"
        }).then((response) => {
            setAuth(true);
            setAuthorized(response.ok);
        }).catch((err) => {
            setAuthorized(false);
            setAuth(true);
        });
    });
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
                        {!authed && (
                            <CircularProgress />
                        )}
                        {authed && (
                            <React.Fragment>
                                <HeaderBar auth={isAuthorized}/>
                                <h1> Place Holder</h1>
                            </React.Fragment>
                        )}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
