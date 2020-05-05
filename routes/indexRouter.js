const express = require('express');
const indexController = require('../controllers/indexController');

const indexRouter = express.Router();
indexRouter.all('/', indexController.actionIndex);

module.exports = indexRouter;
