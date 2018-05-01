const ApiError = require('../../../lib/common/api-error'),
  Repo = require('./repo'),
  mg = require('mongoose'),
  dbPromise = require('../../../mongoose-conn'),
  Grid = require('gridfs-stream');

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
    dbPromise.then(db => {
      var gfs = Grid(db, mg.mongo);
      gfs.findOne({_id: req.params.id}, function (err, file) {
        if (err) {
          next(new ApiError('GridFs Error', err, 400));
          return;
        }
        else if (!file) {
          next(new ApiError('File not found', null, 404));
          return;
        }

        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + file.metadata.fileName + '"');

        var readstream = gfs.createReadStream({
          _id: req.params.id
        });

        readstream.on("error", function (err) {
          res.end();
        });
        readstream.pipe(res);
      });
    });
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
    this.repo.getOne(req.params.id)
      .then(fileInfo => {
        dbPromise.then(db => {
          const gfs = Grid(db, mg.mongo);
          gfs.remove({_id: req.params.id}, function (err, gridStore) {
            if (err) {
              throw (err);
            }
            res.send(fileInfo);
          });
        });
      })
      .catch(next);
  }


}

