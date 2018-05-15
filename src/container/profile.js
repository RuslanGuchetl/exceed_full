import React, {Component} from "react"
import {BrowserRouter as Router, Route, Link} from "react-router-dom"
import {Switch, Redirect} from 'react-router'
import {withLastLocation} from 'react-router-last-location'
import Media from "react-media"
import 'babel-polyfill'
import Http from '../libs/http.js'
import SettingsRouter from './../routes/settings'
import ProductsRouter from './../routes/products'
import UsersRouter from './../routes/users'


export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileShow: false,
      currentPage: '',
      menuIcon: 'fa-bars'
    }
  }

  isAdministrator() {
    if (localStorage.getItem('role') == 'admin') {
      return <li className="menu-items"><Link to="/profile/users" onClick={this.show.bind(this)}>Users</Link></li>
    }
  }

  updateMenuLabel(data) {
    if (data) {
      this.setState({currentPage: data})
    }
  }

  show() {
    if (this.state.mobileShow) {
      this.setState({mobileShow: false, menuIcon: 'fa-bars'});
    } else {
      this.setState({mobileShow: true, menuIcon: 'fa-times'});
    }
  }

  render() {
    const {mobileShow} = this.state;

    return (
      <div className="fullPage">
        <Media query="(max-width: 768px)">
          {matches =>
            matches ? (
                <div className="mobileMenuTop">
                  <div className="inline-menu clearfix">
                    <ul className="nav-menu-top">
                      <li className="menu-items navMenuBar" onClick={this.show.bind(this)}>
                        <p className="menuPage">{this.state.currentPage}</p>
                        <i className={"fas " + this.state.menuIcon}/>
                      </li>
                    </ul>
                    {mobileShow && (
                      <ul className="nav-menu-top">
                        <div className="leftSideItems">
                          <li className="menu-items">
                            <Link to="/profile/products" onClick={this.show.bind(this)}>Shop</Link>
                          </li>
                          {this.isAdministrator()}
                        </div>
                        <div className="rightSideItems">
                          <li className="menu-items">
                            <Link to="/profile/settings" onClick={this.show.bind(this)}>Settings</Link>
                          </li>
                          <li className="menu-items">
                            <Link to="/" onClick={upd}>LogOut</Link>
                          </li>
                        </div>
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div className="inline-menu clearfix">
                  <ul className="nav-menu-top">
                    <div className="leftSideItems">
                      <li className="menu-items">
                        <Link to="/profile/products">Shop</Link>
                      </li>
                      {this.isAdministrator()}
                    </div>
                    <div className="rightSideItems">
                      <li className="menu-items">
                        <Link to="/profile/settings">Settings</Link>
                      </li>
                      <li className="menu-items">
                        <Link to="/" onClick={upd}>LogOut</Link>
                      </li>
                    </div>
                  </ul>
                </div>
              )
          }
        </Media>
        <Switch>
          <Route path="/profile/settings" render={() => (<SettingsRouter onUpdate={this.updateMenuLabel.bind(this)}/>)}/>
          <Route path="/profile/products" render={() => (<ProductsRouter onUpdate={this.updateMenuLabel.bind(this)}/>)}/>
          <Route path="/profile/users" render={() => (<UsersRouter onUpdate={this.updateMenuLabel.bind(this)}/>)}/>
          <Route path="*" render={() => (<Redirect to='/profile/products'/>)}/>
          {checkurl()}
        </Switch>
      </div>
    );
  }
}


function checkurl() {
  let url = "/user";
  let data = localStorage.getItem('token');
  let body = document.getElementById('root');
  body.className += ' ' + 'modalBlock';
  let http = new Http();

  http.get(url, data)
    .then((object) => {
      localStorage.setItem('login', object.login);
      localStorage.setItem('email', object.email);
      localStorage.setItem('password', object.password);
      localStorage.setItem('name', object.name);
      localStorage.setItem('age', object.age);
      localStorage.setItem('gender', object.gender);
      localStorage.setItem('role', object.role);
      body.className = body.className.replace(" modalBlock", "");
    })
    .catch((e) => {
      body.className = body.className.replace(" modalBlock", "");
      console.log('Error: ', e);
    });
}

function upd() {
  localStorage.clear();
}