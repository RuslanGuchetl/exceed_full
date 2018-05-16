import React from "react";
import {Redirect} from 'react-router'
import {saveValid} from './savervalid';
import Sha256 from "js-sha256";
import 'babel-polyfill'
import Http from '../libs/http.js'
import RadioButtons from './radiobuttons'
import {serverUrl} from '../configs/server-url';


export default class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        login: localStorage.getItem('login'),
        email: localStorage.getItem('email'),
        current: '',
        newPass: '',
        name: localStorage.getItem('name'),
        age: localStorage.getItem('age'),
        gender: localStorage.getItem('gender')
      },
      fireRedirect: false,
      fireRedirect2: false
    }
  }

  handleChange(event) {
    event.preventDefault();
    let formValues = this.state.formValues;
    let name = event.target.name;
    let value = event.target.value;
    saveValid();


    formValues[name] = value;

    this.setState({formValues});
  }

  radiob(int) {
    let formValues = this.state.formValues;
    formValues['gender'] = int;
    this.setState({formValues});
  }

  handleSubmit(event) {
    event.preventDefault();
    let userLogin = this.state.formValues['login'];
    let userCurrent = this.state.formValues['current'];
    let userNewPass = this.state.formValues['newPass'];
    let userMail = this.state.formValues['email'];
    let userName = this.state.formValues['name'];
    let userAge = this.state.formValues['age'];
    let userGender = this.state.formValues['gender'];
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlock';
    if (userNewPass == '') {
      let url = serverUrl + "/user";
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "login": userLogin,
        "current": Sha256(userCurrent),
        "email": userMail,
        "name": userName,
        "age": userAge,
        "gender": userGender
      });
      let http = new Http();
      http.put(url, data)
        .then(() => {
          localStorage.setItem('login', userLogin);
          localStorage.setItem('email', userMail);
          localStorage.setItem('name', userName);
          localStorage.setItem('age', userAge);
          localStorage.setItem('gender', userGender);
          alert('Profile successfully updated');
          body.className = body.className.replace(" modalBlock", "");
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    } else {
      let url = serverUrl + "/user";
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "login": userLogin,
        "current": Sha256(userCurrent),
        "new": Sha256(userNewPass),
        "email": userMail,
        "name": userName,
        "age": userAge,
        "gender": userGender
      });
      let http = new Http();
      http.put(url, data)
        .then(() => {
          localStorage.setItem('login', userLogin);
          localStorage.setItem('email', userMail);
          localStorage.setItem('name', userName);
          localStorage.setItem('password', Sha256(userNewPass));
          localStorage.setItem('age', userAge);
          localStorage.setItem('gender', userGender);
          alert('Profile successfully updated');
          body.className = body.className.replace(" modalBlock", "");
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
    let formValues = this.state.formValues;
    formValues['newPass'] = '';
    formValues['current'] = '';
    this.setState({formValues: formValues});
  }

  handleDelete() {
    let userCurrent = this.state.formValues['current'];
    if (Sha256(userCurrent) == localStorage.getItem("password")) {
      let ready = confirm('Are you sure? All data will be erased');
      if (ready) {
        let body = document.getElementById('root');
        body.className += ' ' + 'modalBlock';
        let url = serverUrl + "/user";
        let data = JSON.stringify({
          "token": localStorage.getItem('token'),
          "current": Sha256(userCurrent)
        });
        let http = new Http();
        http.deleteReq(url, data)
          .then(() => {
            localStorage.clear();
            body.className = body.className.replace(" modalBlock", "");
            this.setState({fireRedirect2: true});
          })
          .catch((e) => {
            body.className = body.className.replace(" modalBlock", "");
            console.log('Error: ', e);
          });
      }
    } else {
      alert('Input current password for removing account');
    }
  }

  render() {
    const fireRedirect = this.state.fireRedirect;
    const fireRedirect2 = this.state.fireRedirect2;
    return (
      <div>
        <form className="registration-form" onSubmit={this.handleSubmit.bind(this)}>
          <label className="edit-label"> Login:</label>
          <input className="form-control"
                 type="text"
                 name="login"
                 id="login"
                 placeholder="Login"
                 value={this.state.formValues["login"]}
                 onChange={this.handleChange.bind(this)}
                 minLength="4"
                 maxLength="20"
                 required
          />
          <label className="edit-label"> Email:</label>
          <input className="form-control"
                 type="text"
                 name="email"
                 id="email"
                 placeholder="Email"
                 value={this.state.formValues["email"]}
                 onChange={this.handleChange.bind(this)}
                 maxLength="35"
                 required
          />
          <label className="edit-label"> Current Password:</label>
          <input className="form-control"
                 type="password"
                 name="current"
                 id="password"
                 placeholder="Password"
                 value={this.state.formValues["current"]}
                 onChange={this.handleChange.bind(this)}
                 minLength="6"
                 maxLength="35"
                 required
          />
          <label className="edit-label"> New Password:</label>
          <input className="form-control"
                 type="password"
                 name="newPass"
                 id="confirmPassword"
                 placeholder="Password"
                 value={this.state.formValues["newPass"]}
                 onChange={this.handleChange.bind(this)}
                 minLength="6"
                 maxLength="35"
          />
          <label className="edit-label"> Name:</label>
          <input className="form-control"
                 type="text"
                 name="name"
                 id="name"
                 placeholder="Full Name"
                 value={this.state.formValues["name"]}
                 onChange={this.handleChange.bind(this)}
                 maxLength="20"
          />
          <label className="edit-label"> Age:</label>
          <input className="form-control"
                 type="number"
                 name="age"
                 id="age"
                 placeholder="Your Age"
                 value={this.state.formValues["age"]}
                 onChange={this.handleChange.bind(this)}
                 min="1"
                 max="99"
          />

          <RadioButtons change={this.radiob.bind(this)} value={this.state.formValues.gender}/>

          <div className="form-group">
            <button type="submit" className="btn saving-btn">Save changes</button>
          </div>

          <div className="form-bot">
            <p>For removing account: <a className="btn" onClick={this.handleDelete.bind(this)}>Press here</a></p>
          </div>

        </form>
        {fireRedirect && (
          <Redirect to={'/profile/products'}/>
        )}
        {fireRedirect2 && (
          <Redirect to={'/'}/>
        )}
      </div>
    )
  }
}