const express = require('express'),
  fileRouter = express.Router(),
  FileController = require('./controller'),
  upload = require('../../../lib/middleware/multer-gridfs'),
  authorize = require('../../../lib/middleware/authorize');


const ctrl = new FileController();

module.exports = fileRouter
  // fileInfo handlers
  .get('/info', ctrl.getInfoMany.bind(ctrl))
  .get('/info/:id', ctrl.getInfoOne.bind(ctrl))

  // file handlers
  .delete('/:id', authorize('api:manage'), ctrl.remove.bind(ctrl))
  .get('/:id', ctrl.download.bind(ctrl))
  .post('/', authorize('api:manage'), upload.array('fileUploadField'), ctrl.uploadMany.bind(ctrl))
