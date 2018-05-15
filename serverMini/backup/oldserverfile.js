var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var lowerCase = require('lower-case');
var jsonParser = bodyParser.json();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spa');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const usersSchema = new Schema({
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
  password: String,
  gender: {type: String, default: ''},
  age: Number,
  date: {type: Date, default: Date.now}
});

var User = mongoose.model('User', usersSchema);

app.use(express.static('static'));

app.get('/api', function (req, res) {
  res.send('Hello World!');
});


app.post('/registration', jsonParser, function (req, res) {

  var login = lowerCase(req.body.login);
  var mail = lowerCase(req.body.email);

  User.findOne({"login": login}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (data) {
      return res.send(455, 'This login already exist');
    }
    else {
      User.findOne({"email": mail}, function (err, data) {
        if (err) {
          return console.log(err);
        }
        else if (data) {
          return res.send(456, 'This e-mail is using');
        }
        else {
          var thisUser = new User({
            name: req.body.name,
            login: login,
            email: mail,
            password: req.body.password,
            age: req.body.age
          });

          thisUser.save(function (err) {
            if (err) return console.error(err);
          });
          return res.send(290, '');
        }
      });
    }
  });

});


app.post('/login', jsonParser, function (req, res) {
  var login = lowerCase(req.body.login);
  var password = lowerCase(req.body.password);

  User.findOne({"login": login, "password": password}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (data) {
      return res.send(295, '');
    }
    else {
      return res.send(455, 'Login or/and password is invalid!');
    }
  });
});


app.get('*', function (req, res) {
  res.sendFile(__dirname + '/static/index.html')
});

app.use(function (req, res) {
  res.sendFile(__dirname + '/static/404.html')
});

app.listen(3000, function () {
  console.log('App listening on port 3000');
});