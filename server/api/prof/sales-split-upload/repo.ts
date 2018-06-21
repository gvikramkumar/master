import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    accountId: {type: String, required: true},
    companyCode: String,
    subaccountCode: {type: String, required: true},
    salesTerritoryCode: {type: String, required: true},
    splitPercentage: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'prof_sales_split_pct'}
);

@injectable()
export default class SalesSplitUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'SalesSplitUpload');
  }

}
