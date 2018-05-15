var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('Successfully connected to DataBase!');
});
