import {injectable} from 'inversify';
import {model, Model, Schema} from 'mongoose';
import _ from 'lodash';
import {ApiError} from '../../../lib/common/api-error';
import RepoBase from '../../../lib/base-classes/repo-base';
const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    bkgm_process_start_date: {type: Date, required: true},
    bkgm_process_end_date: {type: Date, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_bkgm_data_proc'}
);

@injectable()
export default class ProcessDateInputRepo extends RepoBase {
  constructor() {
    super(schema, 'DataProc');
  }

}

