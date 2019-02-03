import {svrUtil} from '../common/svr-util';
import {mgc} from './mongoose-conn';
import {ApiError} from '../common/api-error';
import _ from 'lodash';
import AnyObj from '../../../shared/models/any-obj';
import FileRepo from '../../api/file/repo';
import * as Q from 'q';
import {injectable} from 'inversify';

@injectable()
// todo: needs testing. Only uploadFile has been tested so far
export default class FinGridFSBucket {
  gfs;

  constructor(private fileRepo: FileRepo) {
  }

  // we get compile errors as mgc.mongo isn't ready yet, so we have to delay the creation
  getGfs() {
    if (!this.gfs) {
      this.gfs = new mgc.mongo.GridFSBucket(mgc.db);
    }
  }

  /*
  eg:
          return gfs.uploadFile(this.req.file, {
          directory: Directory.businessUpload,
          buUploadType: BuUploadType.dollarUpload,
          buFileType: BusinessUploadFileType.upload
        })
          .then(fileId => {
            return fileRepo.getOneById(fileId)
              .then(x => x);
          })

   */
  addOne(file, metadata: AnyObj = {}) {
    this.getGfs();
    if (!metadata.directory) {
      throw new ApiError('metadata.directory required');
    }
    const fileName = file.originalname;
    metadata.fileName = fileName;
    const uploadStream = this.gfs.openUploadStream(fileName, {
      metadata,
      contentType: file.mimetype
    });
    const fileId = uploadStream.id.toString();
    return new Promise((resolve, reject) => {
      svrUtil.bufferToStream(file.buffer)
        .pipe(uploadStream)
        .on('error', function (err) {
          reject(err);
        })
        .on('finish', function () {
          resolve(fileId); // return the fileId
        });
    });
  }

  addMany(files, _metadata) {
    this.getGfs();
    const promises = [];
    files.forEach((file, idx) => {
      const metadata = _.isArray(_metadata) ? _metadata[idx] : _metadata;
      promises.push(this.addOne(file, metadata));
    })
    return Promise.all(promises); // returns an array of file ids
  }

  getOne(fileId, writableStream) {
    this.getGfs();
    return new Promise((resolve, reject) => {
      this.gfs.openDownloadStream(new mgc.mongo.ObjectID(fileId))
        .pipe(writableStream)
        .on('error', function (err) {
          reject(err);
        })
        .on('finish', function () {
          resolve(fileId);
        });
    });
  }

  getMany(fileIds, writableStream) {
    this.getGfs();
    const promises = [];
    fileIds.forEach(fileId => {
      promises.push(this.getOne(fileId, writableStream));
    })
    return Promise.all(promises);
  }

  removeManyPerSingleMetadata(metadata) {
    this.getGfs();

    return this.fileRepo.getMany(metadata)
      .then(files => {
        const deletePromises = [];
        files.forEach(file => {
          deletePromises.push(this.removeOne(file._id));
        });
        return Promise.all(deletePromises);
      });
  }

  removeOne(fileId) {
    return Q.ninvoke(this.gfs, 'delete', fileId);
  }

}
