const express = require('express'),
  router = express.Router(),
  AllocationRuleController = require('./controller'),
  authorize = require('../../../lib/middleware/authorize');

const ctrl = new AllocationRuleController();

module.exports = router
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authorize('api_manage'), ctrl.add.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', authorize('api_manage'), ctrl.update.bind(ctrl))
  .delete('/:id', authorize('api_admin'), ctrl.remove.bind(ctrl))
