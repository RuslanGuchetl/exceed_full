import React, {Component}from "react";
import {Switch, Redirect} from 'react-router'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Users from './../container/users'

export default class UsersRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  update(data) {
    if (data) {
      if (this.props.onUpdate) {
        this.props.onUpdate(data);
        this.props.onUpdate.bind(this);
      }
    }
  }

  render() {

    return (
      <Switch>
        <Route path="/profile/users/:id" render={() => (<Redirect to='/profile/users'/>)}/>
        <Route path="/profile/users" render={() => (<Users onUpd={this.update.bind(this)}/>)}/>
      </Switch>
    )
  }
}
