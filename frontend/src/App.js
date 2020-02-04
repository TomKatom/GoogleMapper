import React, {Component, useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import 'typeface-roboto'
import { HeaderBar }  from './components/HeaderBar'
import {Login} from './components/login'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Register} from "./components/Register";
import {Container, TextField, Typography, Grid, Link as LinkBTN} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    },
    container: {
        display: 'grid'
    },
    layer: {
        gridColumn: 1,
        gridRow: 1
    }
}));

function App() {
    const classes = useStyles();
    const [authed, setAuth] = useState(false);
    const [isAuthorized, setAuthorized] = useState(false);
    const [clicked, setClicked] = useState(false);
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
                    <React.Fragment>
                        <HeaderBar auth={false} login={true} />
                        <Register/>
                    </React.Fragment>
                </Route>
                <Route path="/login">
                    <React.Fragment>
                        <HeaderBar auth={false} login={true} />
                        <Login />
                    </React.Fragment>
                </Route>
                <Route path="/dev">
                    <React.Fragment>
                        <Container >
                            <Grid>
                                {!clicked && (
                                    <LinkBTN component="Typography" className={classes.layer} onClick={(e) => {setClicked(!clicked)}}>
                                        Some Text
                                    </LinkBTN>
                                )}
                                {clicked && (
                                    <TextField label="Enter Some Text." className={classes.layer} variant="outlined" onChange={HandleEnter} id="Editor"></TextField>
                                )}
                            </Grid>
                        </Container>
                    </React.Fragment>
                </Route>
                <Route path="/">
                        {!authed && (
                            <div className={classes.root}>
                                <CircularProgress size='5rem' />
                            </div>
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
    var textField = document.getElementById("Editor");
    function HandleEnter(e){
        if(e.Key === "Enter"){
            setClicked(!clicked);
            console.log("Fsfdsafdsfs");
        }
    }
}

export default App;
