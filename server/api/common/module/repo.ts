import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    seqnum: {type: Number, required: true},
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
