import React, {Component} from "react";
import {Redirect} from 'react-router'

export default class EditCost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.price,
      title: this.props.title,
      id: this.props.id,
      disable: this.props.dis
    };
  }

  valid() {
    document.getElementById('inputprice').style.border = '2px solid #07d5df';
    document.getElementById('btnprice').style.border = 'none';
  }

  update(e) {
    this.own = true;
    this.setState({value: e.target.value});
  }

  save() {
    let c = this.state.value;
    c = c.trim();
    if (c.match(/^([0-9]{0,15})$/)) {
      this.own = true;
      if (this.props.onSave) {
        this.props.onSave(c);
        this.props.onSave.bind(this);
      }
      this.setState({value: c});
    } else {
      document.getElementById('inputprice').style.border = '2px solid red';
      document.getElementById('btnprice').style.border = '2px solid red';
    }
  }

  CancelInp() {
    this.setState({value: this.props.price});
    this.valid();
  }

  render() {
    if (!this.own) {
      this.own = true;
      this.setState({value: this.props.value});
    }
    else {
      this.own = false;
    }

    return (
      <div className="selectedHomedrop">
        <label className="homeLabel">Price</label>
        <div className="input-group mb-5">
          <input className="form-control editInput"
                 id="inputprice"
                 type="text"
                 onKeyDown={this.valid.bind(this)}
                 value={this.state.value}
                 disabled={this.props.disable}
                 onChange={this.update.bind(this)}
                 placeholder={"Enter the " + this.state.title + "'s price"}
          />
          <div className="input-group-append">
            <button className="btnSelect AddItem"
                    id="btnprice"
                    onClick={this.save.bind(this)}
                    disabled={this.props.disable}
                    type="button">
              Save
            </button>
            <button className="btnSelect DeleteItem"
                    onClick={this.CancelInp.bind(this)}
                    disabled={this.props.disable}
                    type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}