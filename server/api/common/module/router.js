const express = require('express'),
  router = express.Router(),
  ModuleController = require('./controller');

const ctrl = new ModuleController();

module.exports = router
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.add.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl))
