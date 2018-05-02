const express = require('express'),
  fileRouter = express.Router(),
  FileController = require('./controller'),
  upload = require('../../../lib/middleware/multer-gridfs');

const ctrl = new FileController();

module.exports = fileRouter
  // fileInfo handlers
  .get('/info', ctrl.getInfoMany.bind(ctrl))
  .get('/info/:id', ctrl.getInfoOne.bind(ctrl))

  // file handlers
  .delete('/:id', ctrl.remove.bind(ctrl))
  .get('/:id', ctrl.download.bind(ctrl))
  .post('/', upload.array('fileUploadField'), ctrl.uploadMany.bind(ctrl))
