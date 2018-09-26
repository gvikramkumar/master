import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    databaseId: {type: Number, required: true},
    displayOrder: {type: Number, required: true},
    abbrev: {type: String, required: true},
    name: {type: String, required: true},
    status: {type: String, enum: ['A', 'I'], required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_database'}
);

@injectable()
export class DatabaseRepo extends RepoBase {
  autoIncrementField = 'databaseId';

  constructor() {
    super(schema, 'Database');
  }

  getActiveSortedByDisplayOrder() {
    return this.Model.find({status: 'A'})
      .sort({displayOrder: 1});
  }

  getActiveNonAdminSortedByDisplayOrder() {
    return this.Model.find({status: 'A', databaseId: {$ne: 99}})
      .sort({displayOrder: 1});
  }

  getNonAdminSortedByDisplayOrder() {
    return this.Model.find({databaseId: {$ne: 99}})
      .sort({displayOrder: 1});
  }

}
