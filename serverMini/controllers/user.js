var express = require('express');
var mongoose = require('mongoose');
var CryptoJS = require('crypto-js');
var User = require('./../models/user.js');
var lowerCase = require('lower-case');
var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.js');
var _this = this;

exports.createUser = function (userData) {
  var user = {
    name: userData.name,
    login: userData.login,
    email: userData.email,
    password: CryptoJS.SHA256(userData.password),
    age: userData.age
  };
  return new User(user).save()
};

exports.getUser = function (req, res) {
  const authorization = req.get('Authorization');
  var token = authorization.split('Bearer ')[1];
  var decoded = jwtDecode(token);
  var role = decoded.role;
  User.findOne({"_id": decoded.id}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (!data) {
      return res.sendStatus(401);
    } else if (data.role == role) {
      return res.status(200).send(data);
    } else {
      return res.status(400).send(data);
    }
  });
};

exports.checkUser = function (userData) {
  return User
    .findOne({login: userData.login})
    .then(function (doc) {
      if (doc.password == CryptoJS.SHA256(userData.password)) {
        console.log("User password is ok");
        return Promise.resolve(doc)
      } else {
        return Promise.reject("Error wrong")
      }
    })
};

exports.deleteUser = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var id = decoded.id;
  var pass = req.body.current;
  User.findOne({"_id": id}, function (err, data1) {
    if (err) {
      return console.log(err);
    } else if (data1) {
      User.findOne({"_id": id, "password": pass}, function (err, data) {
        if (data) {
          User.findByIdAndRemove(id, function (err) {
            if (err) {
              console.log(err);
            }
          });
          return res.send(200, 'Account was successfully deleted');
        } else {
          return res.send(400, 'Current password not correct!');
        }
      });
    } else {
      return res.send(400, 'Error in update, user not found');
    }
  });
};

exports.updateUser = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var id = decoded.id;
  var pass = req.body.current;
  var log = req.body.login;
  User.findOne({"_id": id}, function (err, data1) {
    if (err) {
      return console.log(err);
    } else if (data1) {
      User.findOne({"_id": id, "password": pass}, function (err, data) {
          if (data) {
            if (data.login !== log) {
              User.findOne({"login": log}, function (err, loginExist) {
                if (err) {
                  return console.log(err);
                } else if (loginExist) {
                  return res.status(400).send('Error in update, login is already in use');
                } else {
                  var new1 = req.body.new;
                  if (new1 === undefined) {
                    var query1 = {'_id': id};
                    var newData1 = {
                      "login": req.body.login,
                      "email": req.body.email,
                      "name": req.body.name,
                      "age": req.body.age,
                      "gender": req.body.gender
                    };
                    User.findOneAndUpdate(query1, newData1, {upsert: true}, function (err, doc) {
                      if (err) return res.status(400).send(err);
                    });
                  } else {
                    var query = {'_id': id};
                    var newData = {
                      "login": req.body.login,
                      "password": req.body.new,
                      "email": req.body.email,
                      "name": req.body.name,
                      "age": req.body.age,
                      "gender": req.body.gender
                    };
                    User.findOneAndUpdate(query, newData, {upsert: true}, function (err, doc) {
                      if (err) return res.status(400).send(err);
                    });
                  }
                  return res.sendStatus(200);
                }
              });
            } else {
              var new1 = req.body.new;
              var newData1 = '';
              if (new1 === undefined) {
                var query1 = {'_id': id};
                if (req.body.age > 0) {
                  newData1 = {
                    "login": req.body.login,
                    "email": req.body.email,
                    "name": req.body.name,
                    "age": req.body.age,
                    "gender": req.body.gender
                  };
                } else {
                  newData1 = {
                    "login": req.body.login,
                    "email": req.body.email,
                    "name": req.body.name,
                    "gender": req.body.gender
                  };
                }
                User.findOneAndUpdate(query1, newData1, {upsert: true}, function (err, doc) {
                  if (err) {
                    return res.status(400).send(err);
                  } else {
                    return res.sendStatus(200);
                  }
                });
              }
              else {
                var query = {'_id': id};
                var newData = {
                  "login": req.body.login,
                  "password": req.body.new,
                  "email": req.body.email,
                  "name": req.body.name,
                  "age": req.body.age,
                  "gender": req.body.gender
                };
                User.findOneAndUpdate(query, newData, {upsert: true}, function (err, doc) {
                  if (err) {
                    return res.status(400).send(err);
                  } else {
                    return res.sendStatus(200);
                  }
                });
              }
            }
          }
          else {
            return res.status(400).send('Current password not correct!');
          }
        }
      );
    }
    else {
      return res.status(400).send('Error in update, user not found');
    }
  })
  ;
}
;

exports.regist = function (req, res) {
  var login = lowerCase(req.body.login);
  var mail = lowerCase(req.body.email);
  User.findOne({"login": login}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (data) {
      return res.status(400).send('This login already exist');
    }
    else {
      User.findOne({"email": mail}, function (err, data) {
        if (err) {
          return console.log(err);
        }
        else if (data) {
          return res.status(400).send('This e-mail is using');
        }
        else {
          _this.createUser(req.body);
          return res.sendStatus(200);
        }
      });
    }
  });
};

exports.signin = function (req, res) {
  var login = lowerCase(req.body.login);
  var password = lowerCase(req.body.password);
  User.findOne({"login": login, "password": password}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    if (data) {
      var payload = {
        id: data._id,
        role: data.role
      };
      var token = jwt.sign(payload, config.secret, {
        expiresIn: 3600
      });
      res.status(200).send({token: token, role: data.role});
    } else {
      return res.status(400).send('Login or/and password is invalid!');
    }
  });
};

exports.allUsers = function (req, res) {
  const authorization = req.get('Authorization');
  var token = authorization.split('Bearer ')[1];
  var decoded = jwtDecode(token);
  var role = decoded.role;
  User.findOne({"_id": decoded.id}, function (err, data) {
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
        User.find({role: 'user'}, function (err, users) {
          if (err) {
            return res.sendStatus(400);
          } else {
            res.status(200).send(users);
          }
        });
      }
    }
  });
};

exports.checkAdministrator = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;

  User.findOne({"_id": decoded.id}, function (err, data) {
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
        return res.sendStatus(200);
      }
    }
  });
};

exports.checkRole = function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;

  User.findOne({"_id": decoded.id}, function (err, data) {
    if (err) {
      return console.log(err);
    }
    else if (!data) {
      return res.sendStatus(401);
    }
    else if (data.role == role) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  });
};

exports.deleteCurrentUser = function (req, res) {
  var curId = req.body.id;
  User.findByIdAndRemove(curId, function (err) {
    if (err) {
      console.log(err);
    } else {
      return res.sendStatus(200);
    }
  });
};