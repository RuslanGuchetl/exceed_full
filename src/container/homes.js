import React, {Component} from "react";
import {Redirect} from 'react-router'
import 'babel-polyfill'
import Http from '../libs/http.js'
import {serverUrl} from '../configs/server-url';
import ArrayEditor from '../component/arrayEditor'

export default class Homes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data2: [],
      item: '',
      show1: false,
      show2: false
    }
  }

  componentWillMount() {
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlock';
    let url = serverUrl + "/categories";
    let data = localStorage.getItem('token');
    let http = new Http();
    http.get(url, data)
      .then((object) => {
        this.setState({data: object, show1: true});
      })
      .catch((e) => {
        console.log('Error: ', e);
      });
    body.className = body.className.replace(" modalBlock", "");
  }

  updateArray(data) {
    if (data == 'category') {
      this.setState({show1: false, show2: false});
      this.updateArray1(data);
    } else if (data == 'item') {
      this.setState({show2: false});
      this.updateArray1(data);
    }
  }

  updateArray1(data) {
    if (data == 'category') {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = serverUrl + "/categories";
      let data = localStorage.getItem('token');
      let http = new Http();
      http.get(url, data)
        .then((object) => {
          this.setState({data: object, show1: true});
        })
        .catch((e) => {
          console.log('Error: ', e);
        });
      body.className = body.className.replace(" modalBlock", "");
    }
    else if (data == 'item') {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = serverUrl + "/item";
      let data = localStorage.getItem('token');
      let http = new Http();
      http.get(url, data)
        .then((object) => {
          this.setState({data2: object, show2: true});
        })
        .catch((e) => {
          console.log('Error: ', e);
        });
      body.className = body.className.replace(" modalBlock", "");
    }
  }

  hider(data) {
    if (data) {
      this.setState({show2: false});
    }
  }

  getItem(thisId) {
    this.setState({show2: false});
    return this.getItem1(thisId);
  }

  getItem1(thisId) {
    let xhr = new XMLHttpRequest();
    let url = serverUrl + "/item";
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlock';
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    let data1 = JSON.stringify({
      "token": localStorage.getItem('token'),
      "role": localStorage.getItem('role'),
      "itemId": thisId
    });
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status == 200) {
          body.className = body.className.replace(" modalBlock","");
          let arr = JSON.parse(xhr.responseText);
          if (arr.length > 0) {
            this.setState({data2: arr, show2: true});
          } else {
            this.setState({data2: arr, show2: true});
          }
        } else if (xhr.status == 401) {
          window.location.href = "/";
        } else {
          return
        }
      }
    };
    xhr.send(data1);
    this.setState({item: thisId});
  }

  render() {
    const {show1} = this.state;
    const {show2} = this.state;

    return (
      <div>
        {show1 && (
          <ArrayEditor urlUpd={serverUrl + "/updatecategories"} urlAdd={serverUrl + "/savecategories"} btnId="categbtn" array={this.state.data} idName="_id"
                       field="categoryName" title="category" getCategory={this.getItem.bind(this)} hideComp={this.hider.bind(this)}
                       updArr={this.updateArray.bind(this)}/>
        )}
        {show2 && (
          <ArrayEditor urlUpd={serverUrl + "/updateitem"} urlAdd={serverUrl + "/saveitem"} btnId="itembtn" array={this.state.data2}
                       val={this.state.item} idName="_id" field="itemName" title="item"
                       updArr={this.updateArray.bind(this)}/>
        )}
      </div>
    );
  }
}