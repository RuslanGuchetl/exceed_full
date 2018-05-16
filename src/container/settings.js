import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Redirect} from 'react-router'
import EditItem from '../component/editProfile';


export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.onUpd) {
      this.props.onUpd('Settings');
      this.props.onUpd.bind(this);
    }
  }

  render() {

    return (
      <div className="mainForm">
        <div className="form-box">
          <div className="form-top">
            <div className="form-top-left">
              <h3>Edit your Profile</h3>
              <p>Change the form below to update your account:</p>
            </div>
            <div className="form-top-right">
              <i className="fa fa-pencil-alt"/>
            </div>
          </div>
          <div className="form-bottom">
            <EditItem/>
          </div>
        </div>
      </div>
    )
  }
}
