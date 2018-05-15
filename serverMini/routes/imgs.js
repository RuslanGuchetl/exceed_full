var express = require('express');
var router = express.Router();
var config = require('./../config/config.js');
var multer = require('multer');
var jwtDecode = require('jwt-decode');
var Auth = require('./../auth/jwtauth.js');


var storage = multer.diskStorage({
  destination: './serverMini/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname + '');
  }
});
var upload = multer({storage: storage});

router.use(upload.single('photo'));

router.post('/image/upload', Auth, function (req, res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var role = decoded.role;
  var id = decoded.id;
  console.log(role, id);
  res.send(req.body.photo);
});

module.exports = router;