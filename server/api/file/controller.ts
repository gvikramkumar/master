import {injectable} from 'inversify';
import {mgc} from '../../lib/database/mongoose-conn';
import Q from 'q';
import _ from 'lodash';
import {svrUtil} from '../../lib/common/svr-util';
import {ApiError} from '../../lib/common/api-error';
import FileRepo from './repo';


@injectable()
export default class FileController {

  constructor(private repo: FileRepo) {
  }

  // 3 ways to go here:
  // get all: just send in parms
  // get latest one: getLatest=true query val (uses uploadDate)
  // group, then get latest of each group: groupField=xxx query val, say groupField=buUploadType
  // will group by buUploadType and then get latest version of each one
  getInfoMany(req, res, next) {
    if (svrUtil.checkParams(req.query, ['directory'], next)) {
      return;
    }
    const params = _.omit(req.query, ['groupField', 'getLatest']);
    if (req.query.groupField) { // groups then gets latest of each group
      this.repo.getManyGroupLatest(params, req.query.groupField)
        .then(items => res.json(items))
        .catch(next);
    } else if (req.query.getLatest) {// gets latest "one" of results
      this.repo.getOneLatest(params)
        .then(items => res.json(items))
        .catch(next);
    } else {
      this.repo.getMany(req.query)
        .then(items => res.json(items))
        .catch(next);
    }
  }

  getInfoOne(req, res, next) {
    this.repo.getOneById(req.params.id)
      .then(item => {
        if (item) {
          res.json(item);
        } else {
          next(new ApiError('Not found.', null, 404));
        }
      })
      .catch(next);
  }

  // file upload/download/remove
  // upload/download
  download(req, res, next) {
    const id = req.params.id;
    this.repo.getOneById(id)
      .then(fileInfo => {
        if (!fileInfo) {
          next(new ApiError('File not found.', null, 400))
          return;
        }
        res.set('Content-Type', fileInfo.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + fileInfo.metadata.fileName + '"');
        const gfs = new mgc.mongo.GridFSBucket(mgc.db);
        const readStream = gfs.openDownloadStream(new mgc.mongo.ObjectID(id));
        //readStream.on('error', next);
        readStream.pipe(res);
      })
      .catch(next);
  }

  uploadMany(req, res, next) {
    return this.repo.getManyByIds(req.files.map(file => file.id))
      .then(files => res.json(files))
      .catch(next);
  }

  // uploadMany does one and many so just use that to simply the endpoint to one
  /*
    uploadOne(req, res, next) {
      return this.repo.getOneById(req.file.id)
        .then(file => res.json(file))
        .catch(next);
    }
  */

  remove(req, res, next) {
    const gfs = new mgc.mongo.GridFSBucket(mgc.db);
    const id = req.params.id;
    this.repo.getOneById(id)
      .then(fileInfo => {
        if (!fileInfo) {
          next(new ApiError('File not found.', null, 400))
          return;
        }
        return Q.ninvoke(gfs, 'delete', new mgc.mongo.ObjectID(id))
          .then(() => res.json(fileInfo));
      })
      .catch(next);
  }


}

