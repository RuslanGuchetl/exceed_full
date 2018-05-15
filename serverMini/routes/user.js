const userCtrl = require('./../controllers/user.js');
var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('./../config/config.js');
var Auth = require('./../auth/jwtauth.js');


router.post('/registration', userCtrl.regist);
router.post('/login', userCtrl.signin);
router.get('/user', Auth, userCtrl.getUser);
router.put('/user', Auth, userCtrl.updateUser);
router.delete('/user', Auth, userCtrl.deleteUser);
router.get('/users', Auth, userCtrl.allUsers);
router.delete('/users', Auth, userCtrl.deleteCurrentUser);


module.exports = router;