const express = require('express'),
  router = express.Router(),
  BusinessUploadController = require('./controller'),
  upload = require('../../../multer-gridfs');

const ctrl = new BusinessUploadController();

module.exports = router
  .post('/', upload.single('fileName'), ctrl.add.bind(ctrl))
