var express = require('express');
var mongoose = require('mongoose');
var ObjectId =require('mongoose').Schema.ObjectId;

var itemsSchema = new mongoose.Schema({
  id: ObjectId,
  parentId: String,
  accessories: Array,
  itemName: String,
  price: String,
  createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Item', itemsSchema);