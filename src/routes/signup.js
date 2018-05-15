import React, {Component}from "react";
import {Switch, Redirect} from 'react-router'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Registration from './../container/registration'

const RegistRoute = () => (
  <Switch>
    <Route path="/signup/:id" render={() => (<Redirect to='/signup'/>)}/>
    <Route path="/signup" component={Registration}/>
  </Switch>
);

export default RegistRoute;