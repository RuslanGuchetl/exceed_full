var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var cors = require('cors');
var jsonParser = bodyParser.json();
var db = require('./serverMini/db/spaDb.js');
var config = require('./serverMini/config/config.js');
var userRoute = require('./serverMini/routes/user.js');
var prodRoute = require('./serverMini/routes/products.js');
var imagesRoute = require('./serverMini/routes/imgs.js');


app.use(express.static('./serverMini/static'));
app.use(jsonParser);
app.use(userRoute);
app.use(prodRoute);
app.use(cors());
app.use(imagesRoute);


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