import {svrUtil} from '../common/svr-util';
import {mgc} from './mongoose-conn';
import {ApiError} from '../common/api-error';
import _ from 'lodash';
import AnyObj from '../../../shared/models/any-obj';


// todo: needs testing. Only uploadFile has been tested so far
export default class GridFSBucket {
  gfs;

  constructor() {
  }

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
  uploadFile(file, metadata: AnyObj = {}) {
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

  uploadFiles(files, _metadata) {
    this.getGfs();
    const promises = [];
    files.forEach((file, idx) => {
      const metadata = _.isArray(_metadata) ? _metadata[idx] : _metadata;
      promises.push(this.uploadFile(file, metadata));
    })
    return Promise.all(promises); // returns an array of file ids
  }

  downloadFile(fileId, writableStream) {
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

  downloadFiles(fileIds, writableStream) {
    this.getGfs();
    const promises = [];
    fileIds.forEach(fileId => {
      promises.push(this.downloadFile(fileId, writableStream));
    })
    return Promise.all(promises);
  }

}
