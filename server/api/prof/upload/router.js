const express = require('express'),
  router = express.Router(),
  DollarUploadController = require('./dollar-upload/controller'),
  MappingUploadController = require('./mapping-upload/controller'),
  DeptUploadController = require('./dept-upload/controller'),
  SalesSplitUploadController = require('./sales-split-upload/controller'),
  ProductClassUploadController = require('./product-class-upload/controller'),
  upload = require('../../../lib/middleware/multer');

const dollarUploadCtrl = new DollarUploadController();
const mappingUploadCtrl = new MappingUploadController();
const deptUploadCtrl = new DeptUploadController();
const salesSplitUploadCtrl = new SalesSplitUploadController();
const productClassUploadCtrl = new ProductClassUploadController();

module.exports = router
  .post('/dollar-upload', upload.single('fileUploadField'), dollarUploadCtrl.upload.bind(dollarUploadCtrl))
  .post('/mapping-upload', upload.single('fileUploadField'), mappingUploadCtrl.upload.bind(mappingUploadCtrl))
  .post('/dept-upload', upload.single('fileUploadField'), deptUploadCtrl.upload.bind(deptUploadCtrl))
  .post('/sales-split-upload', upload.single('fileUploadField'), salesSplitUploadCtrl.upload.bind(salesSplitUploadCtrl))
  .post('/product-class-upload', upload.single('fileUploadField'), productClassUploadCtrl.upload.bind(productClassUploadCtrl))
