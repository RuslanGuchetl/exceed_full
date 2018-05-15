var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db = require('./serverMini/db/spaDb.js');
var config = require('./serverMini/config/config.js');
var userRoute = require('./serverMini/routes/user.js');
var prodRoute = require('./serverMini/routes/products.js');


app.use(express.static('./serverMini/static'));
app.use(jsonParser);
app.use(userRoute);
app.use(prodRoute);

app.get('/api', function (req, res) {
  res.send('Hello World!');
});

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/serverMini/static/index.html')
});

app.use(function (req, res) {
  res.sendFile(__dirname + '/serverMini/static/404.html')
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});