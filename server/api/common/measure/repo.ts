import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    measureId: {type: Number, required: true},
    moduleId: {type: Number, required: true},
    name: {type: String, required: true, trim: true},
    typeCode: {type: String, required: true, trim: true},
    sources: {type: [Number], required: true},
    hierarchies: {type: [String], required: true},
    approvalRequired: {type: Boolean, enum: ['Y', 'N']},
    reportingLevel1: String,
    reportingLevel2: String,
    reportingLevel3: String,
    reportingLevel1Enabled: Boolean,
    reportingLevel2Enabled: Boolean,
    reportingLevel3Enabled: Boolean,
    status: {type: String, enum: ['A', 'I'], required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {
    collection: 'dfa_measure'
  }
  )
;

@injectable()
export default class MeasureRepo extends RepoBase {
  autoIncrementField = 'measureId';
  isModuleRepo = true;

  constructor() {
    super(schema, 'Measure');
  }

}
