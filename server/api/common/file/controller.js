const ApiError = require('../../../lib/common/api-error'),
  Repo = require('./repo'),
  mg = require('mongoose'),
  db = mg.connection.db,
  mongo = mg.mongo,
  GridFSBucket = mongo.GridFSBucket,
  Q = require('q');

module.exports = class FileController {

  constructor() {
    this.repo = new Repo();
  }

  // file info gets
  getInfoMany(req, res, next) {
    this.repo.getMany(req.query)
      .then(rules => res.send(rules))
      .catch(next);
  }

  getInfoOne(req, res, next) {
    this.repo.getOne(req.params.id)
      .then(item => {
        if (item) {
          res.send(item);
        } else {
          res.status(404).end();
        }
      })
      .catch(next)
  }

  // file upload/download/remove
  // upload/download
  download(req, res, next) {
    const id = req.params.id;
    this.repo.getOne(id)
      .then(fileInfo => {
        if (!fileInfo) {
          next(new ApiError('File not found.', null, 400))
          return;
        }
        res.set('Content-Type', fileInfo.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + fileInfo.metadata.fileName + '"');
        const gfs = new GridFSBucket(db);
        const readStream = gfs.openDownloadStream(new mongo.ObjectID(id));
        readStream.on('error', next);
        readStream.pipe(res);
      })
      .catch(next);
  }

  uploadMany(req, res, next) {
    return this.repo.getManyIds(req.files.map(file => file.id), req.query)
      .then(files => res.send(files))
      .catch(next);
  }

  // uploadMany does one and many so just use that to simply the endpoint to one
  /*
    uploadOne(req, res, next) {
      return this.repo.getOne(req.file.id)
        .then(file => res.send(file))
        .catch(next);
    }
  */

  remove(req, res, next) {
    const gfs = new GridFSBucket(db);
    const id = req.params.id;
    this.repo.getOne(id)
      .then(fileInfo => {
        if (!fileInfo) {
          next(new ApiError('File not found.', null, 400))
          return;
        }
        return Q.ninvoke(gfs, 'delete', new mongo.ObjectID(id))
          .then(() => res.send(fileInfo));
      })
      .catch(next);
  }


}

