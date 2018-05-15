import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import TableList from '../component/tableList';
import 'babel-polyfill'
import Http from '../libs/http.js'
import {Redirect} from 'react-router'

export default class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      file: '',
      isload: false
    }
  }

  componentWillMount() {
    let url = "/users";
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

  handleSubmit(e) {
    e.preventDefault();
    console.log('handle uploading-', this.state.file);

    let formData = new FormData();
    formData.append('token', localStorage.getItem('token'));
    formData.append('photo', this.state.file);
    fetch('/image/upload', {
      method: 'POST',
      body: formData
    });

  }


  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({file: file});
    };

    reader.readAsDataURL(file);
  }


  render() {
    const {isload} = this.state;

    return (
      <div>
        {isload && (
          <TableList array={this.state.data}/>
        )}
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input className="fileInput"
                 type="file"
                 onChange={(e) => this.handleImageChange(e)}/>
          <button className="submitButton"
                  type="submit"
                  onClick={(e) => this.handleSubmit(e)}>Upload Image
          </button>
        </form>
      </div>
    );
  }
}