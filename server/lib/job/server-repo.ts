import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';

const schema = new Schema(
  {
    name: {type: String, required: true},
    url: {type: String, required: true},
    primary: {type: Boolean, required: true},
    updatedDate: {type: Boolean, required: true}
  },
  {collection: 'dfa_server'}
);

@injectable()
export default class ServerRepo extends RepoBase {

  constructor() {
    super(schema, 'Server');
  }

}
