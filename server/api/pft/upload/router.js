const express = require('express'),
  router = express.Router(),
  DollarUploadController = require('./dollar-upload/controller'),
  MappingUploadController = require('./mapping-upload/controller'),
  upload = require('../../../lib/middleware/multer');

const dollarUploadCtrl = new DollarUploadController();
const mappingUploadCtrl = new MappingUploadController();
const deptUploadCtrl = new MappingUploadController();

module.exports = router
  .post('/dollar-upload', upload.single('fileUploadField'), dollarUploadCtrl.upload.bind(dollarUploadCtrl))
  .post('/mapping-upload', upload.single('fileUploadField'), mappingUploadCtrl.upload.bind(mappingUploadCtrl))
  .post('/dept-upload', upload.single('fileUploadField'), mappingUploadCtrl.upload.bind(deptUploadCtrl))
