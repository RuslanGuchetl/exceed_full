var express = require('express');
var mongoose = require('mongoose');
var Category = require('./../models/category.js');
var User = require('./../models/user.js');
var jwtDecode = require('jwt-decode');
var _this = this;

exports.createCateg = function (itemId, itemName) {
  var category = {
    parentId: itemId,
    categoryName: itemName
  };
  return new Category(category).save()
};

exports.getHome = function (id) {
  return Category.findOne(id)
};

exports.getCateg = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;
  var id = decoded.id;
  User.findOne({"_id": id}, function (err, data) {
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
        Category.find(function (err, data) {
          if (err) {
            return res.status(400);
          } else if (data) {
            res.status(200).send(data);
          }
        });
      }
    } else {
      return res.sendStatus(401);
    }
  });
};

exports.createCategories = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;
  var id = decoded.id;
  var name = req.body.itemName;
  User.findOne({"_id": id}, function (err, data) {
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
        _this.createCateg(id, name);
        return res.sendStatus(200);
      }
    } else {
      return res.sendStatus(401);
    }
  });
};

exports.updateCateg = function (req, res) {
  var itmName = req.body.itemName;
  var query = {'_id': req.body.itemId};
  var newData = {'categoryName': itmName};
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var id = decoded.id;
  var role = decoded.role;
  User.findOne({"_id": id}, function (err, data) {
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
        Category.findOneAndUpdate(query, newData, {upsert: false}, function (err, doc) {
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