const express = require('express'),
  router = express.Router(),
  AllocationRuleController = require('./controller'),
  authorize = require('../../../lib/middleware/authorize');

const ctrl = new AllocationRuleController();

module.exports = router
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authorize('lala'), ctrl.add.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl))
