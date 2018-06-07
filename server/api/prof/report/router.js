const express = require('express'),
  router = express.Router(),
  ReportController = require('./controller'),
  authorize = require('../../../lib/middleware/authorize');

const ctrl = new ReportController();

module.exports = router
  .post('/:report', authorize('api:manage'), ctrl.getReport.bind(ctrl))
