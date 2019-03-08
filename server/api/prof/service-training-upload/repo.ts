import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';
import {OrmTypes} from '../../../lib/base-classes/Orm';

const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalYear: {type: Number, required: true},
    salesTerritoryCode: {type: String, required: true},
    salesNodeLevel3Code: {type: String, required: true},
    extTheaterName: String,
    salesCountryName: String,
    productFamily: String,
    splitPercentage: {type: Number, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_service_trngsplit_pctmap_upld'}
);

@injectable()
export default class ServiceTrainingUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'ServiceTrainingUpload');
  }

}
