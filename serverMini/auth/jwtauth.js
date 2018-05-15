var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.js');


module.exports = function (req, res, next) {
  const authorization = req.get('Authorization');
  var token = '';
  if (authorization) {
    token = authorization.split('Bearer ')[1];
  } else {
    token = req.body.token;
  }
  if (!token) return res.status(401).send('No token provided.');
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).send('Failed to authenticate token.');
    } else if (decoded) {
      next();
    }
  });
};