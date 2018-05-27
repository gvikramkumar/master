const express = require('express'),
  router = express.Router(),
  LookupController = require('./controller');

const ctrl = new LookupController();

module.exports = router
  .get('/', ctrl.getValues.bind(ctrl));
