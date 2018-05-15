import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import InputItem from '../component/registr';
import Http from '../libs/http.js'
import {Redirect} from 'react-router'
import Sha256 from "js-sha256";

export default class Regist extends React.Component {
  constructor() {
    super();
    this.state = {
      fireRedirect: false
    }
  }

  render() {
    const {from} = this.props.location.state || '/';
    const {fireRedirect} = this.state;

    const store = (e) => {
      let userLogin = document.getElementById('login');
      let userPw = document.getElementById('password');
      let confPw = document.getElementById("confirmPassword");
      let userMail = document.getElementById('email');
      let userName = document.getElementById('firstName');
      let userAge = document.getElementById('age');
      const mail = userMail.value;
      let logs = userLogin.value;
      let newMail = mail.replace(/\s+/g, '');
      let newLogin = logs.replace(/\s+/g, '');

      if (newLogin.value != '' && userPw.value === confPw.value && userPw.value != '' && newMail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        e.preventDefault();
        let body = document.getElementById('root');
        body.className += ' ' + 'modalBlock';
        let url = "/registration";
        let data = JSON.stringify({
          "login": newLogin,
          "password": userPw.value,
          "email": newMail,
          "name": userName.value,
          "age": userAge.value
        });
        let http = new Http();
        http.post(url, data)
          .then(() => {
            body.className = body.className.replace(" modalBlock", "");
            this.setState({fireRedirect: true});
          })
          .catch((e) => {
            body.className = body.className.replace(" modalBlock", "");
            console.log('Error: ', e);
          });
      } else {
        alert('error!');
      }
    };

    return (
      <div className="mainForm">
        <div className="form-box">
          <div className="form-top">
            <div className="form-top-left">
              <h3>Sign up now</h3>
              <p>Fill in the form below to get instant access:</p>
            </div>
            <div className="form-top-right">
              <i className="fas fa-pencil-alt"/>
            </div>
          </div>
          <div className="form-bottom">
            <form className="registration-form" onSubmit={store}>
              <InputItem/>
              <div className="form-group">
                <button type="submit" className="btn">Sign me up!</button>
              </div>
            </form>
            {fireRedirect && (
              <Redirect to={from || '/'}/>
            )}
            <div className="form-bot">
              <p>Already have an account? <Link to="/" className="btn">Sign in here</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}