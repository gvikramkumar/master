import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';
import {OrmTypes} from '../../../lib/base-classes/Orm';


const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    salesTerritoryCode: {type: String, required: true},
    salesNodeLevel1Code: String,
    salesNodeLevel2Code: String,
    salesNodeLevel3Code: String,
    salesNodeLevel4Code: String,
    salesNodeLevel5Code: String,
    salesNodeLevel6Code: String,
    businessEntity: {type: String, required: true},
    technologyGroup: String,
    businessUnit: String,
    productFamily: String,
    splitPercentage: {type: Number, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_service_map_upld'}
);

@injectable()
export default class ServiceMapUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'ServiceMapUpload');
  }

}
