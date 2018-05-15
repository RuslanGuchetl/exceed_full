var express = require('express');
var mongoose = require('mongoose');
var randomstring = require("randomstring");
var randomnumber = require('random-number');
var Item = require('./../models/item.js');
var Category = require('./../models/category.js');
var User = require('./../models/user.js');
var jwtDecode = require('jwt-decode');
var config = require('./../config/config.js');
var _this = this;

exports.create = function (itemId, itemName, itemPrice) {
  var item = {
    parentId: itemId,
    itemName: itemName,
    price: itemPrice
  };
  return new Item(item).save()
};

exports.createRandoms = function (itemId, itemsCount) {
  var options = {
    min:  1
    , max:  1000
    , integer: true
  };

  for (let i = 0; i < itemsCount; i++) {
    let item = {
      parentId: itemId,
      itemName: randomstring.generate({
        length: 8,
        charset: 'alphabetic'
      }),
      price: randomnumber(options)
    };
    new Item(item).save()
  }


};

exports.getItem = function (id) {
  return Item.findOne(id)
};

exports.getItems = function (req, res) {
  Item.find({"parentId": req.body.itemId}, function (err, data) {
    if (err) {
      return res.status(400);
    } else if (data) {
      res.status(200).send(data);
    }
  });
};

exports.createItem = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;
  var id = req.body.itemId;
  var name = req.body.itemName;
  var price = req.body.price;
  User.findOne({"_id": decoded.id}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (!data) {
      return res.sendStatus(401);
    }
    else if (role == data.role) {
      if (role != 'admin') {
        return res.sendStatus(400);
      }
      else {
        _this.create(id, name, price);
        return res.sendStatus(200);
      }
    } else {
      return res.sendStatus(401);
    }
  });
};

exports.createItems = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;
  var id = req.body.id;
  var counts = req.body.counts;
  User.findOne({"_id": decoded.id}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (!data) {
      return res.sendStatus(401);
    }
    else if (role == data.role) {
      if (role != 'admin') {
        return res.sendStatus(400);
      }
      else {
        _this.createRandoms(id, counts);
        return res.sendStatus(200);
      }
    } else {
      return res.sendStatus(401);
    }
  });
};

exports.updateItem = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;
  var id = decoded.id;
  var itmName = req.body.itemName;
  var itmPrice = req.body.price;
  var query = {'_id': req.body.itemId};
  var newData = {'itemName': itmName, 'price': itmPrice};
  User.findOne({"_id": id}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (!data) {
      return res.sendStatus(401);
    }
    else if (role == data.role) {
      if (role != 'admin') {
        return res.sendStatus(401);
      }
      else {
        Item.findOneAndUpdate(query, newData, {upsert: false}, function (err, doc) {
          if (err) {
            return res.send(400, {error: err});
          }
          else if (doc) {
            res.sendStatus(200);
          }
        });
      }
    } else {
      return res.sendStatus(401);
    }
  });
};

exports.allItems = function (req, res) {
  Category.find(function (err, data) {
    if (err) {
      return res.status(400);
    } else if (data) {
      var arr1 = [];
      var arr2 = [];
      arr1 = data;
      Item.find(function (err, data2) {
        if (err) {
          return res.status(400);
        } else if (data2) {
          arr2 = data2;
          res.status(200).send({arrayCateg: arr1, arrayItem: arr2});
        }
      });
    }
  });
};