const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base'),
  db = mg.connection.db;


const schema = new mg.Schema(
  {
    name: {type: String, required: true, trim: true},
    typeCode: {type: String, required: true},
    statusFlag: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'measure'}
);

module.exports = class MeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Measure');
  }

}
