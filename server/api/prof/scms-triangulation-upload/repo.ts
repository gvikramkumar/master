import {injectable} from 'inversify';
import {Schema, SchemaTypes} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    transactionId: {type: SchemaTypes.ObjectId, required: true},
    fiscalMonth: {type: Number, required: true},
    salesNodeLevel2Code: {type: String, required: true},
    scmsValue: {type: String, required: true},
    salesTerritoryCode: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_prof_scms_triangulation_upld'}
);

@injectable()
export default class ScmsTriangulationUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'ScmsTriangulationUpload');
  }

}
