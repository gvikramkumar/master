import {Schema} from 'mongoose';
import RepoBase from '../server/lib/base-classes/repo-base';


const schema = new Schema(
  {
//    mgId: {type: Number, required: true},
    moduleId: {type: Number, required: true},
    name: {type: String, required: true},
    age: {type: Number},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'mgtest'}
);

export default class MgRepo extends RepoBase {
  // autoIncrementField = 'mgId';
  mo

  constructor() {
    super(schema, 'MgTest', true);
  }

}
