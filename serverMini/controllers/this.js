var express = require('express');
var mongoose = require('mongoose');
var Category = require('./../models/category.js');
var Item = require('./../models/item.js');
var User = require('./../models/user.js');
var jwtDecode = require('jwt-decode');

exports.deleteThis = function (req, res) {
  var id = req.body.thisId;
  var name = req.body.thisName;
  var token = req.body.token;
  var role = req.body.role;
  var decoded = jwtDecode(token);
  var userId = decoded.id;
  User.findOne({"_id": userId}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (!data) {
      return res.sendStatus(401);
    }
    else if (role == data.role) {
      if (role != 'admin') {
        return res.sendStatus(400);
      } else {
        if (name == 'item') {
          Item.findByIdAndRemove(id, function (err) {
            if (err) {
              console.log(err);
            } else {
              return res.sendStatus(200);
            }
          });
        } else if (name == 'category') {
          Category.findOne({"_id": id}, function (err, data) {
            if (err) {
              console.log(err);
            } else if (data) {
              Item.remove({'parentId': data._id}, function (err) {
                if (err) {
                  console.log(err);
                }
              });
            }
          });
          Category.findByIdAndRemove(id, function (err) {
            if (err) {
              console.log(err);
            } else {
              return res.sendStatus(200);
            }
          });
        }
      }
    } else {
      return res.sendStatus(401);
    }
  });
};