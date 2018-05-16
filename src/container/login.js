import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Redirect} from 'react-router'
import Sha256 from "js-sha256";
import 'babel-polyfill'
import Http from '../libs/http.js'
import {Compare} from '../component/compare';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      fireRedirect: false
    }
  }

  render() {
    const {from} = this.props.location.state || '/';
    const {fireRedirect} = this.state;

    function validate1() {
      let uLogin = document.getElementById('username');
      uLogin.setCustomValidity('');
    }

    function validate2() {
      let uPw = document.getElementById('userpass');
      uPw.setCustomValidity('');
    }

    const logStore = (e) => {
      let uLogin = document.getElementById('username');
      let uPw = document.getElementById('userpass');
      let pass = uPw.value;
      pass = Sha256(pass);
      e.preventDefault();
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = "http://localhost:3000/login";
      let data = JSON.stringify({"login": uLogin.value, "password": pass});
      let http = new Http();
      http.post(url, data)
        .then((object) => {
          localStorage.setItem('token', object.token);
          localStorage.setItem('role', object.role);
          body.className = body.className.replace(" modalBlock", "");
          this.setState({fireRedirect: true});
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    };

    return (
      <div className="mainForm">
        <div className="form-box">
          <div className="form-top">
            <div className="form-top-left">
              <h3>Login to the site</h3>
              <p>Enter username and password to log on:</p>
            </div>
            <div className="form-top-right">
              <i className="fa fa-lock"/>
            </div>
          </div>
          <form className="form-bottom" onSubmit={logStore.bind(this)}>
            <div className="login-form">
              <div className="form-group">
                <label className="sr-only" htmlFor="login">Username</label>
                <input type="text" name="form-username" placeholder="Username" onChange={validate1}
                       className="form-username form-control"
                       id="username" minLength="4" maxLength="20" required/>
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="password">Password</label>
                <input type="password" name="form-password" placeholder="Password" onChange={validate2}
                       className="form-password form-control" id="userpass" minLength="6" maxLength="35" required/>
              </div>
              <div className="form-group">
                <button onClick={Compare} type="submit" className="btn">Sign in!</button>
              </div>

            </div>
            <div className="form-bot">
              <p>Not registered? <Link to="/signup" className="btn">Create an account</Link></p>
            </div>
          </form>
          {fireRedirect && (
            <Redirect to={from || '/profile/products'}/>
          )}
        </div>
      </div>
    );
  }
}