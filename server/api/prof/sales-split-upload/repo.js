const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base'),
  db = mg.connection.db;

const schema = new mg.Schema(
  {
    transactionId: {type: mg.SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    accountId: {type: String, required: true},
    companyCode: String,
    subAccountCode: {type: String, required: true},
    salesTerritoryCode: {type: String, required: true},
    splitPercentage: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_sales_split_pct'}
);

module.exports = class SalesSplitUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'SalesSplitUpload');
  }

}
