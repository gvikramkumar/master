import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    displayOrder: {type: Number, required: true},
    abbrev: {type: String, required: true},
    name: {type: String, required: true},
    desc: String,
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

  getActiveSortedByDisplayOrderWithRoles() {
    return this.Model.find({status: 'A'})
      .sort({displayOrder: 1})
      .then(modules => {
        return modules;
      })
      .then(modules => this.addRoles(modules))
      .then(modules => {
        return modules;
      });
  }

  getActiveNonAdminSortedByDisplayOrder() {
    return this.Model.find({status: 'A', moduleId: {$ne: 99}})
      .sort({displayOrder: 1});
  }

  getActiveNonAdminSortedByModuleId() {
    return this.Model.find({status: 'A', moduleId: {$ne: 99}})
      .sort({moduleId: 1});
  }

  getNonAdminSortedByDisplayOrder() {
    return this.Model.find({moduleId: {$ne: 99}})
      .sort({displayOrder: 1});
  }

  addRoles(modules) {
    return modules.map(module => {
      const mod = module.toObject ? module.toObject() : module;
      mod.roles = `${module.name}:Business Admin, ${module.name}:Super User, ${module.name}:End User`.toLowerCase();
      return mod;
    });

  }
}
