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
    dealId: String,
    grossUnbilledAccruedFlag: String,
    revenueClassification: String,
    amount: {type: Number, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'sales_split_pct'}
);

module.exports = class SalesSplitUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'SalesSplitUpload');
  }

}
