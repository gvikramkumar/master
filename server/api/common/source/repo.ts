import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    sourceId: {type: Number, required: true},
    name: {type: String, required: true},
    typeCode: {type: String, required: true},
    desc: {type: String},
    status: {type: String, enum: ['A', 'I'], required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_data_source'}
);

@injectable()
export default class SourceRepo extends RepoBase {
  autoIncrementField = 'sourceId';

  constructor() {
    super(schema, 'Source');
  }
}
