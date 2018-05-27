const express = require('express'),
  router = express.Router(),
  LookupController = require('./controller');

const ctrl = new LookupController();

module.exports = router
  .get('/:type', ctrl.getValues.bind(ctrl));
