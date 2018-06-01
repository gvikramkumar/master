const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base'),
  db = mg.connection.db;

const schema = new mg.Schema(
  {
    transactionId: {type: mg.SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    submeasureName: {type: String, required: true},
    product: String,
    sales: String,
    legalEntity: String,
    intBusinessEntity: String,
    scms: String,
    percentage: {type: Number, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'mapping_upload'}
);

module.exports = class MappingUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'MappingUpload');
  }

}
