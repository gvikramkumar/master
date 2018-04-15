
const express = require('express'),
  userCtrl = require('./controller');

router = express.Router();
module.exports = router;

router
  .get('/', userCtrl.getAll)
  .post('/', userCtrl.addOne)
  .get('/:id', userCtrl.getOne)
  .put('/:id', userCtrl.updateOne)
  .delete('/:id', userCtrl.removeOne)

