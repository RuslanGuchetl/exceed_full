import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Switch, Redirect} from 'react-router'
import Media from "react-media"
import 'babel-polyfill'
import ReactPaginate from 'react-paginate'
import Http from '../libs/http.js'
import ModalWind from '../component/modalWindow'

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayCategories: [],
      addCategInp: '',
      editCategInp: '',
      currentArray: [],
      currentArrayOnPage: [],
      currentCategId: '',
      indexedItems: {},
      editingItem: {},
      isAdmin: false,
      show: false,
      show2: false,
      show3: false,
      showEditCateg: false,
      showAddItem: false,
      showEditItem: false,
      isload: false,
      mobileShow: false,
      mobilePagination: 3,
      menuIcon: 'fa-arrow-down',
      pageCount: 1,
      itemsPerPage: 12,
      selected: 0,
      pageItemsArray: []
    }
  }

  componentWillMount() {
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlock';
    if (this.props.onUpd) {
      this.props.onUpd('Shop');
      this.props.onUpd.bind(this);
    }
    let url = "http://localhost:3000/items";
    let data = localStorage.getItem('token');
    let http = new Http();

    if (localStorage.getItem('role') == 'admin') {
      this.setState({isAdmin: true, itemsPerPage: 11})
    }

    http.get(url, data)
      .then((object) => {
        if (object.arrayCateg[0]) {
          let firstId = object.arrayCateg[0]._id;
          let indexedItems = {};

          let arrayOnPage = [];
          let itemsCount = this.state.itemsPerPage;

          if (localStorage.getItem('role') == 'admin') {
            itemsCount = 11;
          }

          object.arrayItem.forEach(function (elem) {
            indexedItems[elem.parentId] = indexedItems[elem.parentId] || [];
            indexedItems[elem.parentId].push(elem);
          });

          let fullCurrentArray = indexedItems[firstId];

          let pageCount = Math.ceil(indexedItems[firstId].length / this.state.itemsPerPage);
          if (pageCount == 0) {
            pageCount = 1;
          }

          arrayOnPage = fullCurrentArray.slice(0, itemsCount);

          this.setState({
            arrayCategories: object.arrayCateg,
            indexedItems: indexedItems,
            currentCategId: firstId,
            editCategInp: object.arrayCateg[0].categoryName,
            currentArray: indexedItems[firstId],
            currentArrayOnPage: arrayOnPage,
            pageCount: pageCount,
            isload: true,
            show: true
          });
          body.className = body.className.replace(" modalBlock", "");
        } else {
          this.setState({
            arrayCategories: [],
            indexedItems: {},
            currentCategId: '',
            currentArray: [],
            pageCount: 1,
            isload: true,
            show: true
          });
          body.className = body.className.replace(" modalBlock", "");
        }
        if (localStorage.getItem('role') == 'admin') {
          this.setState({show2: true});
        }
      })
      .catch((e) => {
        body.className = body.className.replace(" modalBlock", "");
        console.log('Error: ', e);
      });
  }


  handleCheck(e) {
    let currentCateg = e.currentTarget.dataset.id;
    let itemsArray = this.state.indexedItems;
    let itemsPerPage = this.state.itemsPerPage;
    let categories = this.state.arrayCategories;
    let newItems = [];
    let value = '';

    if (itemsArray[currentCateg]) {
      newItems = itemsArray[currentCateg];
    }

    let pageCount = Math.ceil(newItems.length / itemsPerPage);
    if (pageCount == 0) {
      pageCount = 1;
    }

    categories.forEach(function (elem) {
      if (elem._id == currentCateg) {
        value = elem.categoryName;
      }
    });

    let arrayOnPage = newItems.slice(0, itemsPerPage);

    this.setState({
      currentArray: newItems,
      currentArrayOnPage: arrayOnPage,
      currentCategId: currentCateg,
      editCategInp: value,
      pageCount: pageCount
    });

    this.showCategs();
  }


  list(arr) {
    if (arr) {
      if (arr.length > 0) {
        let cid = this.state.currentCategId;
        if (this.state.isAdmin) {
          return arr.map((item) => (
            <li key={item._id} className={cid == item._id ? "MenuItems activeItems" : "MenuItems"} data-id={item._id}
                id={item._id}
                onClick={this.handleCheck.bind(this)}>
              <p className="categoryLabelAdmin">{item.categoryName}</p>
              <div className="editIconBar">
                <i className="editIcon fas fa-edit" onClick={this.editCategId.bind(this)}/>
                <i className="editIcon far fa-trash-alt" onClick={this.deleteCategId.bind(this)}/>
              </div>
            </li>
          ))
        } else {
          return arr.map((item) => (
            <li className={cid == item._id ? "MenuItems activeItems" : "MenuItems"} key={item._id} data-id={item._id}
                id={item._id}
                onClick={this.handleCheck.bind(this)}>
              <p className="categoryLabel">{item.categoryName}</p>
            </li>
          ))
        }
      }
    } else {
      return (<li className="MenuItems">Nothing yet. Add something</li>)
    }
  }

  updateArray() {
    let url = "http://localhost:3000/items";
    let data = localStorage.getItem('token');
    let http = new Http();
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlock';
    http.get(url, data)
      .then((object) => {
        let firstId = object.arrayCateg[0]._id;
        let indexedItems = {};
        object.arrayItem.forEach(function (elem) {
          indexedItems[elem.parentId] = indexedItems[elem.parentId] || [];
          indexedItems[elem.parentId].push(elem)
        });

        this.setState({
          arrayCategories: object.arrayCateg,
          indexedItems: indexedItems,
          currentCategId: firstId,
          currentArray: indexedItems[firstId],
          isload: true,
          show: true
        });
        if (this.state.isAdmin) {
          this.setState({show2: true});
        }
        body.className = body.className.replace(" modalBlock", "");
      })
      .catch((e) => {
        body.className = body.className.replace(" modalBlock", "");
        console.log('Error: ', e);
      });
  }

  deleteCategId() {
    this.DeleteIdServer('category');
  }


  validCateg() {
    document.getElementById('inputCateg').style.borderBottom = '1px solid #ffffff';
  }

  validEditCateg() {
    document.getElementById('inputEditCateg').style.borderBottom = '1px solid #ffffff';
  }

  categCancel() {
    if (this.state.addCategInp == '') {
      this.HideAddCateg();
    } else {
      this.setState({addCategInp: ''});
      this.validCateg();
    }
  }

  categEditCancel() {
    if (this.state.editCategInp == '') {
      this.HideEditCateg();
    } else {
      this.setState({editCategInp: ''});
      this.validEditCateg();
    }
  }

  updInp(e) {
    let val = e.target.value;
    this.setState({addCategInp: val});
  }

  updEditInp(e) {
    let val = e.target.value;
    this.setState({editCategInp: val});
  }

  addCateg() {
    let c = this.state.addCategInp;
    c = c.trim();
    if (c.match(/^(([A-za-z]{1,10})((.)?)(([A-za-z0-9]{1,7})?))$/)) {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = "http://localhost:3000/categories";
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "itemName": c
      });
      let http = new Http();

      http.post(url, data)
        .then(() => {
          this.setState({
            isload: false,
            show: false,
            show2: false,
            show3: false,
            addCategInp: '',
          });
          body.className = body.className.replace(" modalBlock", "");
          return this.updateArray();
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
    else {
      this.setState({addCategInp: c});
      document.getElementById('inputCateg').style.borderBottom = '1px solid red';
    }
  }


  editCateg() {
    let c = this.state.editCategInp;
    c = c.trim();
    if (c.match(/^(([A-za-z]{1,10})((.)?)(([A-za-z0-9]{1,7})?))$/)) {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = "http://localhost:3000/categories";
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "id": this.state.currentCategId,
        "itemName": c
      });
      let http = new Http();

      http.put(url, data)
        .then(() => {
          this.setState({
            isload: false,
            show: false,
            show2: false,
            show3: false,
            addCategInp: '',
          });
          body.className = body.className.replace(" modalBlock", "");
          return this.updateArray();
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
    else {
      this.setState({addCategInp: c});
      document.getElementById('inputEditCateg').style.borderBottom = '1px solid red';
    }
  }

  itemList(arr) {
    if (arr) {
      if (arr.length > 0) {
        if (this.state.isAdmin) {
          return arr.map((item) => (
            <div className="categoriesItem" key={item._id}>
              <div className="itemImage"><img src="https://placebear.com/g/190/190" alt="image"/></div>
              <div className="itemTitle">{item.itemName}</div>
              <div className="itemPrice">{item.price}</div>
              <i className="editItemIcon fas fa-edit" id={item._id} onClick={this.editItem.bind(this)}/>
              <i className="deleteItemIcon far fa-trash-alt" id={item._id} onClick={this.deleteItem.bind(this)}/>
            </div>
          ))
        } else {
          return arr.map((item) => (
            <div className="categoriesItem" key={item._id}>
              <div className="itemImage"><img src="https://placebear.com/g/190/190" alt="image"/></div>
              <div className="itemTitle">{item.itemName}</div>
              <div className="itemPrice">{item.price}</div>
            </div>
          ))
        }
      }
    }
  }

  editItem(e) {
    let id = e.target.id;
    let item = {};
    let CurrentArray = this.state.currentArray;
    CurrentArray.forEach(function (elem) {
      if (elem._id == id) {
        item = elem;
      }
    });
    this.setState({showEditItem: true, editingItem: item});
  }

  deleteItem(e) {
    let id = e.target.id;
    this.DeleteIdServer('item', id);
  }

  AddCateg() {
    this.setState({show2: false, show3: true});
  }

  HideAddCateg() {
    this.setState({show2: true, show3: false});
  }

  HideEditCateg() {
    this.setState({showEditCateg: false, editCategInp: ''});
  }

  DeleteIdServer(name, itemId) {
    let id = '';
    if (name == 'category') {
      id = this.state.currentCategId;
    } else if (name == 'item') {
      id = itemId;
    }
    let sure = confirm("Are you sure?");
    if (sure) {
      let body = document.getElementById('root');
      body.className += ' ' + 'modalBlock';
      let url = "http://localhost:3000/categories";
      let data = JSON.stringify({
        "token": localStorage.getItem('token'),
        "role": localStorage.getItem('role'),
        "thisName": name,
        "thisId": id
      });
      let http = new Http();

      http.deleteReq(url, data)
        .then(() => {
          body.className = body.className.replace(" modalBlock", "");
          return this.DeleteByIdClient(name, itemId);
        })
        .catch((e) => {
          body.className = body.className.replace(" modalBlock", "");
          console.log('Error: ', e);
        });
    }
  }

  DeleteByIdClient(name, itemId) {
    if (name == 'category') {
      let id = this.state.currentCategId;
      let itemsArray = this.state.indexedItems;
      let categories = this.state.arrayCategories;

      if (itemsArray[id]) {
        delete itemsArray.id;
      }

      for (let i = 0; i < categories.length; i++) {
        if (categories[i]._id == id) {
          categories.splice(i, 1);

          if ((i == 0) && (!(categories.length == 0))) {
            let cid = categories[i]._id;
            let name = categories[i].categoryName;
            let curArr = [];
            if (itemsArray[cid]) {
              curArr = itemsArray[cid];
            } else {
              curArr = [];
            }

            let itemsPerPage = this.state.itemsPerPage;
            let pages = Math.ceil(curArr.length / itemsPerPage);
            if (pages == 0) {
              pages = 1;
            }
            let arrayOnPage = curArr.slice(0, itemsPerPage);

            this.setState({
              currentCategId: cid,
              arrayCategories: categories,
              indexedItems: itemsArray,
              currentArray: curArr,
              currentArrayOnPage: arrayOnPage,
              editCategInp: name,
              pageCount: pages
            });
          } else if ((i > 0) && (!(categories.length == 0))) {
            let cid = categories[i - 1]._id;
            let name = categories[i - 1].categoryName;
            let curArr = [];
            if (itemsArray[cid]) {
              curArr = itemsArray[cid];
            } else {
              curArr = [];
            }
            let itemsPerPage = this.state.itemsPerPage;
            let pages = Math.ceil(curArr.length / itemsPerPage);
            if (pages == 0) {
              pages = 1;
            }
            let arrayOnPage = curArr.slice(0, itemsPerPage);
            this.setState({
              currentCategId: cid,
              arrayCategories: categories,
              indexedItems: itemsArray,
              currentArray: curArr,
              currentArrayOnPage: arrayOnPage,
              editCategInp: name,
              pageCount: pages

            });
          }
          else {
            this.setState({
              currentCategId: '',
              arrayCategories: [],
              indexedItems: {},
              currentArray: [],
              currentArrayOnPage: [],
              editCategInp: ''
            });
          }
        }
      }
    } else if (name == 'item') {
      let item = itemId;
      let category = this.state.currentCategId;
      let itemsArray = this.state.indexedItems;
      let currentArray = this.state.currentArray;
      let currentArrayOnPage = this.state.currentArrayOnPage;

      let categArray = itemsArray[category];
      for (let i = 0; i < currentArray.length; i++) {
        if (currentArray[i]._id == item) {
          currentArray.splice(i, 1);
        }
      }
      for (let i = 0; i < currentArrayOnPage.length; i++) {
        if (currentArrayOnPage[i]._id == item) {
          currentArrayOnPage.splice(i, 1);
        }
      }
      for (let i = 0; i < categArray.length; i++) {
        if (categArray[i]._id == item) {
          categArray.splice(i, 1);
        }
      }

      let itemsPerPage = this.state.itemsPerPage;
      let pages = Math.ceil(categArray.length / itemsPerPage);
      if (pages == 0) {
        pages = 1;
      }

      itemsArray[category] = categArray;
      this.setState({
        indexedItems: itemsArray,
        currentArray: currentArray,
        currentArrayOnPage: currentArrayOnPage,
        pageCount: pages
      });
    }
  }

  addNewItem() {
    this.setState({showAddItem: true});
  }


  updateItem(title, id, data, price, itemId) {
    if (title == 'category') {
      let categories = this.state.arrayCategories;
      categories.forEach(function (elem) {
        if (elem._id == id) {
          elem.categoryName = data;
        }
      });
      this.setState({arrayCategories: categories, showEditCateg: false, editCategInp: data});
    } else if (title == 'item') {
      let itemsArray = this.state.indexedItems;
      let currentArray = this.state.currentArray;
      let currentArrayOnPage = this.state.currentArrayOnPage;
      let categArray = itemsArray[id];
      for (let i = 0; i < currentArray.length; i++) {
        if (currentArray[i]._id == itemId) {
          currentArray[i].itemName = data;
          currentArray[i].price = price;
        }
      }
      for (let i = 0; i < currentArrayOnPage.length; i++) {
        if (currentArrayOnPage[i]._id == itemId) {
          currentArrayOnPage[i].itemName = data;
          currentArrayOnPage[i].price = price;
        }
      }
      for (let i = 0; i < categArray.length; i++) {
        if (categArray[i]._id == itemId) {
          categArray[i].itemName = data;
          categArray[i].price = price;
        }
      }
      itemsArray[id] = categArray;
      this.setState({
        indexedItems: itemsArray,
        currentArray: currentArray,
        currentArrayOnPage: currentArrayOnPage,
        showEditItem: false
      });
    }
  }

  addItem(bool) {
    if (bool) {
      this.setState({
        show: false,
        show3: false,
        addCategInp: '',
        showAddItem: false
      });
      return this.addItem1();
    }
  }

  addItem1() {
    let url = "http://localhost:3000/items";
    let data = localStorage.getItem('token');
    let http = new Http();
    let body = document.getElementById('root');
    body.className += ' ' + 'modalBlock';
    http.get(url, data)
      .then((object) => {
        let indexedItems = {};
        object.arrayItem.forEach(function (elem) {
          indexedItems[elem.parentId] = indexedItems[elem.parentId] || [];
          indexedItems[elem.parentId].push(elem)
        });
        let currentArray = indexedItems[this.state.currentCategId];

        let itemsPerPage = this.state.itemsPerPage;
        let pages = Math.ceil(currentArray.length / (itemsPerPage));
        let arrayOnPage = currentArray.slice(0, itemsPerPage);

        this.setState({
          indexedItems: indexedItems,
          currentArray: indexedItems[this.state.currentCategId],
          currentArrayOnPage: arrayOnPage,
          pageCount: pages,
          show: true,
          show2: true
        });
        body.className = body.className.replace(" modalBlock", "");
      })
      .catch((e) => {
        body.className = body.className.replace(" modalBlock", "");
        console.log('Error: ', e);
      });
  }


  handlePageClick(data) {
    let selected = data.selected;
    let itemsPerPage = this.state.itemsPerPage;
    let array = this.state.currentArray;
    let pageArray = array.slice(selected * itemsPerPage, (selected + 1) * itemsPerPage);
    this.setState({currentArrayOnPage: pageArray, selected: selected});
    window.scrollTo(0, 0);
  }

  mobile() {
    this.setState({mobilePagination: 2, mobileShow: false});
  }

  desktop() {
    this.setState({mobilePagination: 3, mobileShow: true});
  }

  closeModal(bool) {
    if (bool) {
      this.setState({showEditCateg: false})
    }
  }

  closeModalAdd(bool) {
    if (bool) {
      this.setState({showAddItem: false})
    }
  }

  closeModalEdit(bool) {
    if (bool) {
      this.setState({showEditItem: false})
    }
  }

  editCategId() {
    this.setState({showEditCateg: true});
  }

  showCategs() {
    if (this.state.mobileShow) {
      this.setState({mobileShow: false, menuIcon: 'fa-arrow-down'});
    } else {
      this.setState({mobileShow: true, menuIcon: 'fa-arrow-up'});
    }
  }


  render() {
    const {isload} = this.state;
    const {show} = this.state;
    const {show2} = this.state;
    const {show3} = this.state;
    const {showEditCateg} = this.state;
    const {showAddItem} = this.state;
    const {showEditItem} = this.state;
    const {mobileShow} = this.state;

    return (
      <div className="wrapper">
        {isload && (
          <div className="categoriesMenu">
            <Media query="(max-width: 768px)">
              {matches =>
                matches ? (
                    <ul className="menuCatalog">
                      {this.mobile.bind(this)}
                      <span className="menuLabel" onClick={this.showCategs.bind(this)}>
                      <i className={"fas " + this.state.menuIcon}/>
                        {this.state.editCategInp}
                      </span>
                      {mobileShow && (
                        <div className="itemsContainerMobile">
                          {this.list(this.state.arrayCategories)}
                          {show3 && (<li className="MenuItems MenuItemsAdd">
                            <div className="input-group mb-5 menuInput">
                              <input className="form-control editInput"
                                     id="inputCateg"
                                     type="text"
                                     onKeyDown={this.validCateg.bind(this)}
                                     value={this.state.addCategInp}
                                     onChange={this.updInp.bind(this)}
                                     placeholder={"Add category"}
                              />
                              <i className="CategInputCheck far fa-check-circle" onClick={this.addCateg.bind(this)}/>
                              <i className="CategInputCancel fas fa-ban" onClick={this.categCancel.bind(this)}/>
                            </div>
                          </li>)}
                          {show2 && (<div className="plusIcon" onClick={this.AddCateg.bind(this)}>+ Add Category</div>)}
                        </div>
                      )}
                    </ul>
                  ) : (
                    <ul className="menuCatalog">
                      {this.desktop.bind(this)}
                      <span className="menuLabel">Categories:</span>
                      {this.list(this.state.arrayCategories)}
                      {show3 && (<li className="MenuItems MenuItemsAdd">
                        <div className="input-group mb-5 menuInput">
                          <input className="form-control editInput"
                                 id="inputCateg"
                                 type="text"
                                 onKeyDown={this.validCateg.bind(this)}
                                 value={this.state.addCategInp}
                                 onChange={this.updInp.bind(this)}
                                 placeholder={"Add category"}
                          />
                          <i className="CategInputCheck far fa-check-circle" onClick={this.addCateg.bind(this)}/>
                          <i className="CategInputCancel fas fa-ban" onClick={this.categCancel.bind(this)}/>
                        </div>
                      </li>)}
                      {show2 && (<div className="plusIcon" onClick={this.AddCateg.bind(this)}>+ Add Category</div>)}
                    </ul>
                  )
              }
            </Media>
          </div>
        )}
        <Media query="(max-width: 768px)">
          {matches =>
            matches ? (
        <ReactPaginate previousLabel={"prev"}
                       nextLabel={"next"}
                       breakLabel={".."}
                       breakClassName={"break-me"}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={1}
                       pageRangeDisplayed={2}
                       onPageChange={this.handlePageClick.bind(this)}
                       containerClassName={"pagination paginationTop"}
                       subContainerClassName={"pages paginationTop"}
                       activeClassName={"active"}
                       forcePage={this.state.selected}
        />
              ) : (
                <ReactPaginate previousLabel={"prev"}
                               nextLabel={"next"}
                               breakLabel={".."}
                               breakClassName={"break-me"}
                               pageCount={this.state.pageCount}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={3}
                               onPageChange={this.handlePageClick.bind(this)}
                               containerClassName={"pagination paginationTop"}
                               subContainerClassName={"pages paginationTop"}
                               activeClassName={"active"}
                               forcePage={this.state.selected}
                />
              )}
        </Media>

        {show && (
          <div className="itemsList">
            {this.itemList(this.state.currentArrayOnPage)}
            {show && (this.state.isAdmin) && (
              <div className="AddNewItem" onClick={this.addNewItem.bind(this)}>
                <i className="fas fa-plus"/>
              </div>
            )}
          </div>
        )}

        <Media query="(max-width: 768px)">
          {matches =>
            matches ? (
                <ReactPaginate previousLabel={"prev"}
                               nextLabel={"next"}
                               breakLabel={".."}
                               breakClassName={"break-me"}
                               pageCount={this.state.pageCount}
                               marginPagesDisplayed={1}
                               pageRangeDisplayed={2}
                               onPageChange={this.handlePageClick.bind(this)}
                               containerClassName={"pagination paginationTop"}
                               subContainerClassName={"pages paginationTop"}
                               activeClassName={"active"}
                               forcePage={this.state.selected}
                />
              ) : (
                <ReactPaginate previousLabel={"prev"}
                               nextLabel={"next"}
                               breakLabel={".."}
                               breakClassName={"break-me"}
                               pageCount={this.state.pageCount}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={3}
                               onPageChange={this.handlePageClick.bind(this)}
                               containerClassName={"pagination paginationTop"}
                               subContainerClassName={"pages paginationTop"}
                               activeClassName={"active"}
                               forcePage={this.state.selected}
                />
              )}
        </Media>

        {showEditCateg && (
          <ModalWind inputId="inputEditCateg" title="category" id={this.state.currentCategId}
                     url="http://localhost:3000/categories"
                     value={this.state.editCategInp} onUpd={this.updateItem.bind(this)}
                     closeModal={this.closeModal.bind(this)}/>
        )}
        {showAddItem && (
          <ModalWind inputId="inputAddItem" title="item" id={this.state.currentCategId} url="http://localhost:3000/item"
                     value="" onAdd={this.addItem.bind(this)}
                     closeModal={this.closeModalAdd.bind(this)}/>
        )}
        {showEditItem && (
          <ModalWind inputId="inputEditItem" title="item" id={this.state.currentCategId}
                     url="http://localhost:3000/item"
                     value="" onUpd={this.updateItem.bind(this)} items={this.state.editingItem}
                     closeModal={this.closeModalEdit.bind(this)}/>
        )}
      </div>
    );
  }
}