import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';
import {GroupingSubmeasure} from './grouping-submeasure';

const filterLevelSchema = new Schema({
  productLevel: {type: String, enum: ['PF', 'BU', 'TG', 'PID']},
  salesLevel: {type: String, enum: ['LEVEL1', 'LEVEL2', 'LEVEL3', 'LEVEL4', 'LEVEL5', 'LEVEL6']},
  scmsLevel: {type: String, enum: ['SCMS']},
  entityLevel: {type: String, enum: ['BE']},
  internalBELevel: {type: String, enum: ['INTERNAL BE', 'INTERNAL SUB BE']},
  glSegLevel: {type: [String], enum: ['ACCOUNT', 'SUB ACCOUNT', 'COMPANY']},
  countryLevel: {type: String},
  externalTheaterLevel: {type: String}
})

const indicatorsSchema = new Schema({
  dollarUploadFlag: {type: String, enum: ['Y', 'N'], required: true},
  manualMapping: {type: String, enum: ['Y', 'N'], required: true},
  groupFlag: {type: String, enum: ['Y', 'N'], required: true},
  retainedEarnings: {type: String, enum: ['Y', 'N'], required: true},
  transition: {type: String, enum: ['Y', 'N'], required: true},
  corpRevenue: {type: String, enum: ['Y', 'N'], required: true},
  dualGaap: {type: String, enum: ['Y', 'N'], required: true},
  twoTier: {type: String, enum: ['Y', 'N'], required: true},
  deptAcct: {type: String, enum: ['Y', 'N', 'D', 'A'], required: true},
  service: {type: String, enum: ['Y', 'N'], required: true},
  allocationRequired: {type: String, enum: ['Y', 'N'], required: true},
  passThrough: {type: String, enum: ['Y', 'N'], required: true}
})

const schema = new Schema({
    submeasureId: {type: Number, required: true},
    submeasureKey: {type: Number, required: true},
    moduleId: {type: Number, required: true},
    name: {type: String, required: true},
    desc: String,
    sourceId: Number,
    measureId: {type: Number, required: true},
    startFiscalMonth: Number,
    endFiscalMonth: Number,
    processingTime: {type: String},
    pnlnodeGrouping: String,
    inputFilterLevel: filterLevelSchema,
    manualMapping: filterLevelSchema,
    reportingLevels: [String],
    indicators: indicatorsSchema,
    rules: [String],
    countryMatch: String,
    extTheaterMatch: String,
    categoryType: String,
    groupingSubmeasureId: Number,
    sourceSystemAdjTypeId: Number,
    glAcctNumber: Number,
    manualMixHw: Number,
    manualMixSw: Number,
    inputProductFamily: String,
    allocProductFamily: String,
    activeStatus: {type: String, enum: ['A', 'I'], required: true},
    status: {type: String, enum: ['A', 'I', 'P', 'D'], required: true},
    approvedOnce: {type: String, enum: ['Y', 'N'], required: true},
    // we validate early in approval repos, when this isn't set yet, if we set it before validation,
    // we mess up our concurrency check, can't win then, we'll sacrifice the required=true
    approvalReminderTime: {type: Date},
    approvalUrl: {type: String},
    approvedBy: {type: String},
    approvedDate: {type: Date},
    createdBy: {type: String},
    createdDate: {type: Date},
    updatedBy: {type: String},
    updatedDate: {type: Date}
  },
  {
    collection: 'dfa_submeasure'
  });

@injectable()
export default class SubmeasureRepo extends RepoBase {
  autoIncrementField = 'submeasureKey';
  secondAutoIncrementField = 'submeasureId';
  isModuleRepo = true;

  constructor() {
    super(schema, 'Submeasure');
  }

}

