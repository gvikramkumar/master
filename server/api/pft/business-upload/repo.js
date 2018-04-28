const mg = require('mongoose'),
  Buffer = mg.Types.Buffer;

const schema = new mg.Schema(
  {
    userId: {type: String, required: true},
    uploadType: {type: String, required: true},
    fileNameAndExt: {type: String, required: true},
    fileData: {type: Buffer, required: true},
    uploadDate: {type: String, required: true}
  },
  {collection: 'business_upload'}
);

module.exports = class BusinessUploadRepo {
  constructor() {
  }

}
