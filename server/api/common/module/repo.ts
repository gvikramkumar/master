import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    displayOrder: {type: Number, required: true},
    abbrev: {type: String, required: true},
    name: {type: String, required: true}
  },
  {collection: 'dfa_module'}
);

@injectable()
export default class ModuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Module');
  }
}
