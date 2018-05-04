const ApiError = require('../../../lib/common/api-error'),
  Repo = require('./repo'),
  mg = require('mongoose'),
  db = mg.connection.db,
  mongo = mg.mongo,
  GridFSBucket = mongo.GridFSBucket,
  Q = require('q'),
  util = require('../../../lib/common/util'),
  _ = require('lodash');

module.exports = class FileController {

  constructor() {
    this.repo = new Repo();
  }

  // 3 ways to go here:
  // get all: just send in parms
  // get latest one: getLatest=true query val (uses uploadDate)
  // group, then get latest of each group: groupField=xxx query val, say groupField=buUploadType
  // will group by buUploadType and then get latest version of each one
  getInfoMany(req, res, next) {
    if(util.checkParams(req.query, ['directory'], next)) {
      return;
    }
    const params = _.omit(req.query, ['groupField', 'getLatest']);
    if (req.query.groupField) { // groups then gets latest of each group
      this.repo.getManyGroupLatest(params, req.query.groupField)
        .then(items => res.send(items))
        .catch(next);
    } else if (req.query.getLatest) {// gets latest "one" of results
        this.repo.getOneLatest(params)
          .then(items => res.send(items))
          .catch(next);
      } else {
      this.repo.getMany(req.query)
        .then(items => res.send(items))
        .catch(next);
    }
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
    return this.repo.getManyIds(req.files.map(file => file.id))
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

