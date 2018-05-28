const express = require('express'),
  router = express.Router(),
  OpenPeriodController = require('./controller'),
  authorize = require('../../../lib/middleware/authorize');

const ctrl = new OpenPeriodController();

module.exports = router
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authorize('api:manage'), ctrl.handlePost.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', authorize('api:manage'), ctrl.update.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
