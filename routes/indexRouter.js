const express = require('express');
const indexController = require('../controllers/indexController');
const testController = require('./../controllers/testController');

const indexRouter = express.Router();
indexRouter.all('/', indexController.actionIndex);
indexRouter.all('/test', testController.actionIndex);

module.exports = indexRouter;
