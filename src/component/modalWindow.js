import React, {Component} from "react";
import 'babel-polyfill'
import Http from '../libs/http.js'
import {serverUrl} from '../configs/server-url';


export default class ModalWind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      inputId: this.props.inputId,
      itemName: '',
      itemId: '',
      price: '',
      oldPrice: '',
      file: '',
      editImage: false
    }
  }

  componentDidMount() {
    if (this.props.items) {
      let item = this.props.items;
      let id = item._id;
      let label = item.itemName;
      let cost = item.price;
      this.setState({price: cost, oldPrice: cost, itemName: label, value: label, itemId: id});
    }
  }

  editCheck() {
    let c = this.state.value;
    c = c.trim();
    let id = '';
    if (this.props.title == 'category') {
      id = this.props.id;
    } else if (this.props.title == 'item') {
      id = this.state.itemId;
    }
    if (c.match(/^(([A-za-z]{1,10})((.)?)(([A-za-z0-9]{1,7})?))$/)) {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = this.props.url;
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "itemName": c,
        "itemId": id,
        "price": this.state.price
      });
      let http = new Http();

      http.put(url, data)
        .then(() => {
          if (this.props.onUpd) {
            this.props.onUpd(this.props.title, this.props.id, c, this.state.price, id);
            this.props.onUpd.bind(this);
          }
          body.className = body.className.replace(" modalBlock", "");
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
    else {
      this.setState({value: c});
      document.getElementById(this.state.inputId).style.borderBottom = '1px solid red';
    }
  }

  addCheck() {
    let c = this.state.value;
    c = c.trim();
    if (c.match(/^(([A-za-z]{1,10})((.)?)(([A-za-z0-9]{1,7})?))$/)) {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = this.props.url;
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "itemName": c,
        "itemId": this.props.id,
        "price": this.state.price
      });
      let http = new Http();

      http.post(url, data)
        .then(() => {
          if (this.props.onAdd) {
            this.props.onAdd(true);
            this.props.onAdd.bind(this);
          }
          body.className = body.className.replace(" modalBlock", "");
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
    else {
      this.setState({value: c});
      document.getElementById(this.state.inputId).style.borderBottom = '1px solid red';
    }
  }

  changePrice(e) {
    let c = e.target.value;
    c = c.trim();
    if (c.match(/^([0-9]{0,8})$/)) {
      this.setState({price: c});
    }
  }


  upd(e) {
    let val = e.target.value;
    this.setState({value: val});
  }

  valid() {
    document.getElementById(this.state.inputId).style.borderBottom = '1px solid #ffffff';
  }

  valid2() {
    document.getElementById('inputprice').style.borderBottom = '1px solid #ffffff';
  }

  editCancel() {
    if (this.state.itemName) {
      this.setState({value: this.state.itemName});
    } else {
      this.setState({value: this.props.value});
    }
    this.valid();
  }

  priceCancel() {
    if (this.state.oldPrice) {
      this.setState({price: this.state.oldPrice});
    } else {
      this.setState({price: this.props.value});
    }
    this.valid2();
  }

  editClose() {
    if (this.props.closeModal) {
      this.props.closeModal(true);
      this.props.closeModal.bind(this);
    }
  }


  handleSubmit(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('token', localStorage.getItem('token'));
    formData.append('itemCategId', this.props.id);
    formData.append('itemId',  this.state.itemId);
    formData.append('photo', this.state.file);
    let url = serverUrl + '/image/upload';
    fetch(url, {
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

    return (
      <div className="modal">
        {(this.props.title == "category") && (
          <div className="modalContent">
            <label className="homeLabel">{"Edit " + this.props.title}</label>
            <div className="input-group mb-5 menuInput">
              <input className="form-control editModalInput"
                     id={this.state.inputId}
                     type="text"
                     onKeyDown={this.valid.bind(this)}
                     value={this.state.value}
                     onChange={this.upd.bind(this)}
                     placeholder="Edit category"
              />
              <i className="CategInputCheck far fa-check-circle" onClick={this.editCheck.bind(this)}/>
              <i className="CategInputCancel fas fa-ban" onClick={this.editCancel.bind(this)}/>
            </div>
            <span className="modalClose" onClick={this.editClose.bind(this)}>&times;</span>
          </div>
        )}

        {(this.props.title == "item") && (!(this.props.items)) && (
          <div className="modalContent">
            <label className="homeLabel">{"Add " + this.props.title}</label>
            <div className="input-group mb-5 menuInput">
              <input className="form-control editModalInput"
                     id={this.state.inputId}
                     type="text"
                     onKeyDown={this.valid.bind(this)}
                     value={this.state.value}
                     onChange={this.upd.bind(this)}
                     placeholder="Edit item's name"
              />
              <i className="CategInputCancel fas fa-ban" onClick={this.editCancel.bind(this)}/>
            </div>
            <label className="homeLabel">Price</label>
            <div className="input-group mb-5 menuInput">
              <input className="form-control editModalInput"
                     id="inputprice"
                     type="text"
                     onKeyDown={this.valid2.bind(this)}
                     value={this.state.price}
                     onChange={this.changePrice.bind(this)}
                     placeholder="Add price"
              />
              <i className="CategInputCancel fas fa-ban" onClick={this.priceCancel.bind(this)}/>
            </div>
            <i className="addItemCheck far fa-check-circle" onClick={this.addCheck.bind(this)}/>
            <span className="modalClose" onClick={this.editClose.bind(this)}>&times;</span>
          </div>
        )}

        {(this.props.title == "item") && (this.props.items) && (
          <div className="modalContent">
            <label className="homeLabel">{"Edit " + this.props.title}</label>
            <div className="input-group mb-5 menuInput">
              <input className="form-control editModalInput"
                     id={this.state.inputId}
                     type="text"
                     onKeyDown={this.valid.bind(this)}
                     value={this.state.value}
                     onChange={this.upd.bind(this)}
                     placeholder="Edit item's name"
              />
              <i className="CategInputCancel fas fa-ban" onClick={this.editCancel.bind(this)}/>
            </div>


            <label className="homeLabel">Price</label>
            <div className="input-group mb-5 menuInput">
              <input className="form-control editModalInput"
                     id="inputprice"
                     type="text"
                     onKeyDown={this.valid2.bind(this)}
                     value={this.state.price}
                     onChange={this.changePrice.bind(this)}
                     placeholder="Add price"
              />
              <i className="CategInputCancel fas fa-ban" onClick={this.priceCancel.bind(this)}/>
            </div>

            {(this.props.items) && (
              <form className="uploadForm" onSubmit={(e) => this.handleSubmit(e)}>
              <input className="fileInput"
                     type="file"
                     onChange={(e) => this.handleImageChange(e)}/>
              <button className="submitButton"
                      type="submit"
                      onClick={(e) => this.handleSubmit(e)}>Upload
              </button>
            </form>
            )}

            <i className="addItemCheck far fa-check-circle" onClick={this.editCheck.bind(this)}/>
            <span className="modalClose" onClick={this.editClose.bind(this)}>&times;</span>

          </div>
        )}
      </div>
    )
  }
}