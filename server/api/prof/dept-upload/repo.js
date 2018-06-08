const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base'),
  db = mg.connection.db;

const schema = new mg.Schema(
  {
    transactionId: {type: mg.SchemaTypes.ObjectId, required: true},
    submeasureName: {type: String, required: true},
    departmentCode: String,
    startAccountCode: String,
    endAccountCode: String,
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_department_acc_map'}
);

module.exports = class DeptUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'DeptUpload');
  }

}
