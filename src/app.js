import React, {Component}from "react";
import ReactDOM from "react-dom";
import {render} from 'react-dom';
import {Switch, Redirect, browserHistory} from 'react-router'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {LastLocationProvider} from 'react-router-last-location';
import RegistRoute from './routes/signup';
import Login from './container/login';
import Profile from './container/profile';

import './css/style.css';

const Index = () => (
  <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/signup" component={RegistRoute}/>
        <Route path="/:id" render = {()=> (<Redirect to='/'/>)}/>
      </Switch>
  </Router>
);

export default Index;


const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<Index/>, wrapper) : false;