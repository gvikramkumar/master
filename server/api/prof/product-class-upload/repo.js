const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base'),
  db = mg.connection.db;

const schema = new mg.Schema(
  {
    transactionId: {type: mg.SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    submeasureName: {type: String, required: true},
    splitCategory: {type: String, required: true},
    splitPercentage: {type: Number, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_swalloc_manual_mix'}
);

module.exports = class ProductClassUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'ProductClassUpload');
  }

}
