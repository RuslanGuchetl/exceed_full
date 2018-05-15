import React, {Component} from "react";
import {Redirect} from 'react-router'
import EditInput from './editInput'

export default class ArrayEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: this.props.array,
      selectValue: '',
      selectedLabel: '',
      value: '',
      optionAdd: false,
      val: this.props.val,
      disable: true,
      disableBtn: false,
      disableDel: true,
      label: '',
      price: '',
    };
  }

  edit(data, id, price) {
    let str = this.props.title + 'Name';
    let arr1 = this.state.arr;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i]._id == id) {
        arr1[i][str] = data;
        arr1[i].price = price;
        let array = this.state.arr;
        array[i] = arr1[i];
        this.setState({arr: array, selectedLabel: data, price: price});
      }
    }
  };

  addItm() {
    let str = 'Add ' + this.props.title;
    this.setState({
      disableBtn: true,
      disableDel: true,
      disable: false,
      optionAdd: true,
      selectValue: '',
      selectedLabel: '',
      label: str,
      price: ''
    });
    if (this.props.hideComp) {
      this.props.hideComp(this.props.title);
      this.props.hideComp.bind(this);
    }
  }

  addItem(data) {
    if (data) {
      if (this.props.updArr) {
        this.props.updArr(this.props.title);
        this.props.updArr.bind(this);
      }
    }
  }


  deleteById() {
    let sure = confirm("Are you sure?");
    if (sure) {
      let xhr = new XMLHttpRequest();
      let url = "/deletebyid";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "role": localStorage.getItem('role'),
        "thisName": this.props.title,
        "thisId": this.state.selectValue
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

      let arr1 = this.state.arr;
      let id = this.state.selectValue;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i]._id == id) {
          arr1.splice(i, 1);
          let str = this.props.title + 'Name';
          if (arr1 === undefined || arr1.length == 0) {
            this.setState({
              arr: arr1,
              selectedLabel: '',
              selectValue: '',
              price: '',
              disableBtn: false,
              disableDel: true,
              disable: true,
            });
            if (this.props.title == 'category') {
              if (this.props.hideComp) {
                this.props.hideComp(this.props.title);
                this.props.hideComp.bind(this);
              }
            }
          } else if (i == 0) {
            this.setState({arr: arr1, selectedLabel: arr1[i][str], selectValue: arr1[i]._id, price: arr1[i].price});
            let selectedValue = arr1[i]._id;
            if (this.props.getCategory) {
              this.props.getCategory(selectedValue);
              this.props.getCategory.bind(this);
            }
          }
          else {
            this.setState({
              arr: arr1,
              selectedLabel: arr1[i - 1][str],
              selectValue: arr1[i - 1]._id,
              price: arr1[i - 1].price
            });
            let selectedValue = arr1[i - 1]._id;
            if (this.props.getCategory) {
              this.props.getCategory(selectedValue);
              this.props.getCategory.bind(this);
            }
          }
        }
      }
    }
    else {
      return
    }
  }


  handleChange(event) {
    event.preventDefault();
    let selectBox = event.target;
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    let Label = selectBox.options[selectBox.selectedIndex].label;
    let arr = this.props.array;
    let cost = '';

    for (let i = 0; i < arr.length; i++) {
      if (arr[i][this.props.idName] == selectedValue) {
        if (this.props.title == 'item') {
          cost = arr[i].price
        }
        if (this.props.getCategory) {
          this.props.getCategory(selectedValue);
          this.props.getCategory.bind(this);
        }
      }
    }

    let value = event.target.value;
    let str = 'Edit ' + this.props.title;
    this.setState({
      selectValue: value,
      selectedLabel: Label,
      disable: false,
      optionAdd: false,
      disableBtn: false,
      disableDel: false,
      label: str,
      price: cost
    });
  }

  list(arr, props) {
    if (arr.length > 0) {
      return arr.map((item) => (
        <option className="options" key={item[props.idName]} value={item[props.idName]} label={item[props.field]}/>))
    } else {
      return
    }
  }

  render() {
    const spacebtn = this.props.title + 'sEditor';
    const savebtn = this.props.title + 'EditorUpd';

    return (
      <div className="EditModule">
        <div className="selectedHomedrop">
          <label className="homeLabel toUpperLabel">{this.props.title}</label>
          <div className="input-group mb-5">
            <select className="form-control home-select" value={this.state.selectValue}
                    onChange={this.handleChange.bind(this)}>
              <option value="" label="Choose..." disabled/>
              {this.list(this.props.array, this.props)}

            </select>
            <div className="input-group-append">
              <button className="btnSelect AddItem"
                      disabled={this.state.disableBtn}
                      onClick={this.addItm.bind(this)}
                      type="button">
                Add
              </button>
              <button className="btnSelect DeleteItem"
                      disabled={this.state.disableDel}
                      onClick={this.deleteById.bind(this)}
                      type="button">
                Delete
              </button>
            </div>
          </div>
        </div>
        <EditInput value={this.state.selectedLabel}
                   title={this.props.title}
                   options={this.state.optionAdd}
                   spaceId={spacebtn}
                   btnUpd={savebtn}
                   urlUpd={this.props.urlUpd}
                   urlAdd={this.props.urlAdd}
                   id={this.state.selectValue}
                   val={this.props.val}
                   onAdd={this.addItem.bind(this)}
                   onSave={this.edit.bind(this)}
                   dis={this.state.disable}
                   label={this.state.label}
                   price={this.state.price}
        />
      </div>
    );
  }
}