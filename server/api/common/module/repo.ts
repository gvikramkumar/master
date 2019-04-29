import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';
import AnyObj from '../../../../shared/models/any-obj';


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

  getMany(filter: AnyObj = {}) {
    return super.getMany(filter)
      .then(modules => this.addRoles(modules));
  }

  getActiveSortedByDisplayOrder() {
    return this.getMany({status: 'A', setSort: 'displayOrder'});
  }

  getNonAdminSortedByDisplayOrder() {
    return this.getMany({moduleId: {$ne: 99}, setSort: 'displayOrder'});
  }

  addRoles(modules) {
    return modules.map(module => {
      const mod = module.toObject ? module.toObject() : module;
      mod.roles = `${module.name}:Business Admin, ${module.name}:Super User, ${module.name}:Business User, ${module.name}:End User`.toLowerCase();
      return mod;
    });

  }
}
