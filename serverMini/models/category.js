var express = require('express');
var mongoose = require('mongoose');
var ObjectId =require('mongoose').Schema.ObjectId;

var categSchema = new mongoose.Schema({
  id: ObjectId,
  parentId: String,
  categoryName: String,
  createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Category', categSchema);