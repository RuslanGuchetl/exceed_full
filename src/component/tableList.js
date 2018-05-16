import React, {Component} from "react";
import 'babel-polyfill'
import Http from '../libs/http.js'

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.array,
    }
  }

  DeleteUser(e) {
    let id = e.target.id;
    let result = confirm('Are you sure?');
    if (result) {
      let url = "http://localhost:3000/users";
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "id": id
      });
      let http = new Http();
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      http.deleteReq(url, data)
        .then(() => {
          let array = this.state.data;
          for (let i = 0; i < array.length; i++) {
            if (array[i]._id == id) {
              array.splice(i, 1);
            }
            this.setState({data: array});
          }
          body.className = body.className.replace(" modalBlock", "");
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
  }

  render() {

    return (
      <table className="steelBlueCols">
        <thead>
        <tr>
          <td>User id:</td>
          <td>Login:</td>
          <td>E-mail:</td>
          <td>Name:</td>
          <td>Gender:</td>
          <td>Age:</td>
          <td></td>
        </tr>
        </thead>
        <tbody>{this.state.data.map((item, key) => {
          return (
            <tr key={key}>
              <td>{item._id}</td>
              <td>{item.login}</td>
              <td>{item.email}</td>
              <td>{item.name}</td>
              <td>{item.gender}</td>
              <td>{item.age}</td>
              <td><p onClick={this.DeleteUser.bind(this)} id={item._id} className="delBtn">Delete</p></td>
            </tr>
          )
        })}</tbody>
      </table>
    );
  }
}