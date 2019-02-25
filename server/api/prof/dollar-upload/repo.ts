import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    submeasureName: {type: String, required: true},
    product: String,
    sales: String,
    scms: String,
    legalEntity: String,
    intBusinessEntity: String,
    dealId: String,
    grossUnbilledAccruedFlag: {type: String, enum: ['Y', 'N']},
    revenueClassification: String,
    amount: {type: Number, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_input_amnt_upld'}
);

@injectable()
export default class DollarUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'DollarUpload');
  }

}
