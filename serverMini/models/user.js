var express = require('express');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.ObjectId;

var usersSchema = new mongoose.Schema({
  id: ObjectId,
  name: String,
  login: {
    type: String,
    index: true,
    unique:true
  },
  email: {
    type: String,
    index: true,
    unique:true
  },
  password : {
    type: String,
    required: true
  },
  gender: {type: String, default: ''},
  role: {type: String, default: 'user'},
  age: Number,
  date: {type: Date, default: Date.now}
});


module.exports = mongoose.model('User', usersSchema);