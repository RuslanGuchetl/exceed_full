import React, {Component} from "react";
import {Redirect} from 'react-router'

export default class EditInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      title: this.props.title,
      id: '',
      price: '',
      show3: false,
      disable: this.props.dis,
      option: this.props.options
    };
  }

  componentWillMount() {
    if (this.props.title == 'item') {
      this.setState({show3: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props != nextProps) {
      this.setState({
        id: nextProps.id,
        value: nextProps.value,
        price: nextProps.price
      });
    }
  }

  valid() {
    document.getElementById(this.props.spaceId).style.border = '2px solid #07d5df';
    document.getElementById(this.props.btnUpd).style.border = 'none';
  }

  valid2() {
    document.getElementById('inputprice').style.border = '2px solid #07d5df';
  }

  update(e) {
    this.setState({value: e.target.value});
  }

  addItm() {
    let c = this.state.value;
    c = c.trim();
    if (c.match(/^(([A-za-z0-9]{1,15})((.)?)(([A-za-z0-9]{1,15})?)((.)?)(([A-za-z0-9]{1,15})?)((.)?)([0-9]{1,5})?)$/)) {
      let xhr = new XMLHttpRequest();
      let url = this.props.urlAdd;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "itemName": c,
        "itemId": this.props.val,
        "price": this.state.price
      });
      xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            return
          } else if (xhr.status == 401) {
            window.location.href = "/";
          } else {
            alert(xhr.responseText);
          }
        }
      };
      xhr.send(data);
      this.setState({value: c});
      if (this.props.onAdd) {
        let bool = true;
        this.props.onAdd(bool);
        this.props.onAdd.bind(this);
      }
    } else {
      document.getElementById(this.props.spaceId).style.border = '2px solid red';
      document.getElementById(this.props.btnUpd).style.border = '2px solid red';
    }
  }


  save() {
    let c = this.state.value;
    c = c.trim();
    if (c.match(/^(([A-za-z0-9]{1,15})((.)?)(([A-za-z0-9]{1,15})?)((.)?)(([A-za-z0-9]{1,15})?)((.)?)([0-9]{1,5})?)$/)) {
      let xhr = new XMLHttpRequest();
      let url = this.props.urlUpd;
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "itemName": c,
        "itemId": this.props.id,
        "price": this.state.price
      });
      xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
          body.className = body.className.replace(" modalBlock", "");
          if (xhr.status === 200) {
            return
          } else if (xhr.status == 401) {
            window.location.href = "/";
          } else {
            alert(xhr.responseText);
          }
        }
      };
      xhr.send(data);
      if (this.props.onSave) {
        this.props.onSave(c, this.props.id, this.state.price);
        this.props.onSave.bind(this);
      }
      this.setState({value: c});
    } else {
      document.getElementById(this.props.spaceId).style.border = '2px solid red';
      document.getElementById(this.props.btnUpd).style.border = '2px solid red';
    }
  }

  changePrice(e) {
    let c = e.target.value;
    c = c.trim();
    if (c.match(/^([0-9]{0,15})$/)) {
      this.setState({price: c});
    }
  }

  buttonFunc() {
    if (this.props.options == true) {
      return (
        <button className="btnSelect AddItem"
                id={this.props.btnUpd}
                onClick={this.addItm.bind(this)}
                disabled={this.props.dis}
                type="button">
          Save
        </button>
      )
    } else if (this.props.options == false) {
      return (
        <button className="btnSelect AddItem"
                id={this.props.btnUpd}
                onClick={this.save.bind(this)}
                disabled={this.props.dis}
                type="button">
          Save
        </button>
      )
    }
  }


  CancelInp() {
    this.setState({value: this.props.value});
    this.valid();
  }

  CancelInp2() {
    this.setState({price: this.props.price});
    this.valid2();
  }

  render() {

    const {show3} = this.state;

    return (
      <div>
        <div className="selectedHomedrop">
          <label className="homeLabel">{this.props.label}</label>
          <div className="input-group mb-5">
            <input className="form-control editInput"
                   id={this.props.spaceId}
                   type="text"
                   onKeyDown={this.valid.bind(this)}
                   value={this.state.value}
                   disabled={this.props.dis}
                   onChange={this.update.bind(this)}
                   placeholder={"Enter the " + this.state.title + " name"}
            />
            <div className="input-group-append">
              {this.buttonFunc()}
              <button className="btnSelect DeleteItem"
                      onClick={this.CancelInp.bind(this)}
                      disabled={this.props.dis}
                      type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
        {show3 && (
        <div className="selectedHomedrop">
          <label className="homeLabel">Price</label>
          <div className="input-group mb-5">
            <input className="form-control editInput"
                   id="inputprice"
                   type="text"
                   onKeyDown={this.valid2.bind(this)}
                   value={this.state.price}
                   disabled={this.props.dis}
                   onChange={this.changePrice.bind(this)}
                   placeholder={"Enter the " + this.state.title + "'s price"}
            />
            <div className="input-group-append">
              <button className="btnSelect DeleteItem doubleBtn"
                      onClick={this.CancelInp2.bind(this)}
                      disabled={this.props.dis}
                      type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>)}
      </div>
    );
  }
}