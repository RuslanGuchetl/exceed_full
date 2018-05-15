var express = require('express');
var router = express.Router();
const categCtrl = require('./../controllers/categories.js');
const itemCtrl = require('./../controllers/item.js');
const thisCtrl = require('./../controllers/this.js');
var config = require('./../config/config.js');
var Auth = require('./../auth/jwtauth.js');

router.get('/categories', Auth, categCtrl.getCateg);
router.post('/categories', Auth, categCtrl.createCategories);
router.put('/categories', Auth, categCtrl.updateCateg);

router.delete('/categories', Auth, thisCtrl.deleteThis);

router.get('/item', Auth, itemCtrl.getItems);
router.get('/items', Auth, itemCtrl.allItems);
router.post('/item', Auth, itemCtrl.createItem);
router.put('/item', Auth, itemCtrl.updateItem);

router.post('/items', Auth, itemCtrl.createItems);

module.exports = router;