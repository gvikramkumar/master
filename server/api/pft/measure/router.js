const express = require('express'),
  router = express.Router(),
  MeasureController = require('./controller'),
  authorize = require('../../../lib/middleware/authorize');

const ctrl = new MeasureController();

module.exports = router
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authorize('api:manage'), ctrl.add.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', authorize('api:manage'), ctrl.update.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
