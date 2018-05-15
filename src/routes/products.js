import React, {Component}from "react";
import {Switch, Redirect} from 'react-router'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Products from './../container/products'

export default class ShopRoute extends React.Component {
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
        <Route path="/profile/products/:id" render={() => (<Redirect to='/profile/products'/>)}/>
        <Route path="/profile/products" render={() => (<Products onUpd={this.update.bind(this)}/>)}/>
      </Switch>
    )
  }
}
