import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import TableList from '../component/tableList';
import 'babel-polyfill'
import Http from '../libs/http.js'
import {Redirect} from 'react-router'
import {serverUrl} from '../configs/server-url';


export default class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isload: false
    }
  }

  componentWillMount() {
    let url = serverUrl + "/users";
    let data = localStorage.getItem('token');
    let http = new Http();
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlockAdmin';
    http.get(url, data)
      .then((object) => {
        body.className = body.className.replace(" modalBlockAdmin", "");
        this.setState({data: object, isload: true});
        if (this.props.onUpd) {
          this.props.onUpd('Users');
          this.props.onUpd.bind(this);
        }
      })
      .catch((e) => {
        body.className = body.className.replace(" modalBlockAdmin", "");
        console.log('Error: ', e);
      });
  }


  render() {
    const {isload} = this.state;

    return (
      <div>
        {isload && (
          <TableList array={this.state.data}/>
        )}
      </div>
    );
  }
}