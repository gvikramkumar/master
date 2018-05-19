const mg = require('mongoose'),
  RepoBase = require('../../../lib/models/repo-base'),
  db = mg.connection.db;

const schema = new mg.Schema(
  {
    submeasureName: {type: String, required: true},
    product: String,
    sales: String,
    legalEntity: String,
    intbusinessEntity: String,
    scms: String,
    dealId: String,
    grossUnbilledAccruedFlag: String,
    revenueClassification: String,
    amount: {type: Number, required: true}
  },
  {collection: 'dollar_upload'}
);

module.exports = class DollarUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'DollarUpload');
  }

}
