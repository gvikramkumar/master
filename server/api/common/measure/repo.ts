import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    name: {type: String, required: true, trim: true},
    typeCode: {type: String, required: true},
    statusFlag: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'dfa_measure'}
);

@injectable()
export default class MeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Measure', true);
  }

}
