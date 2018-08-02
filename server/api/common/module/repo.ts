import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    displayOrder: {type: Number, required: true},
    abbrev: {type: String, required: true},
    name: {type: String, required: true},
    status: {type: String, enum: ['A', 'I'], required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_module'}
);

@injectable()
export class ModuleRepo extends RepoBase {
  autoIncrementField = 'moduleId';

  constructor() {
    super(schema, 'Module');
  }

  getActiveSortedByDisplayName() {
    return this.Model.find({status: 'A'})
      .sort({displayOrder: 1});
  }

  getActiveNonAdminSortedByDisplayName() {
    return this.Model.find({status: 'A', moduleId: {$ne: 99}})
      .sort({displayOrder: 1});
  }

}
