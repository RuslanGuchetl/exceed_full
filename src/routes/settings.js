import React, {Component}from "react";
import {Switch, Redirect} from 'react-router'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Settings from './../container/settings'

export default class SettingsRoute extends React.Component {
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
        <Route path="/profile/settings/:id" render={() => (<Redirect to='/profile/settings'/>)}/>
        <Route path="/profile/settings" render={() => (<Settings onUpd={this.update.bind(this)}/>)}/>
      </Switch>
    )

  }
}
