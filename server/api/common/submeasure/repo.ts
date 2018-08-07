import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';
import {GroupingSubmeasure} from './grouping-submeasure';

const filterLevelSchema = new Schema({
  productLevel: {type: String, enum: ['PF', 'BU', 'TG', 'PID']},
  salesLevel: String,
  scmsLevel: String,
  internalBELevel: String,
  entityLevel: String
})

const indicatorsSchema = new Schema({
  dollarUploadFlag: {type: String, enum: ['Y', 'N'], required: true},
  approveFlag: {type: String, enum: ['Y', 'N'], required: true},
  manualMapping: {type: String, enum: ['Y', 'N'], required: true},
  expenseSSOT: {type: String, enum: ['Y', 'N'], required: true},
  manualMix: {type: String, enum: ['Y', 'N'], required: true},
  groupFlag: {type: String, enum: ['Y', 'N'], required: true},
  retainedEarnings: {type: String, enum: ['Y', 'N'], required: true},
  transition: {type: String, enum: ['Y', 'N'], required: true},
  corpRevenue: {type: String, enum: ['Y', 'N'], required: true},
  dualGaap: {type: String, enum: ['Y', 'N'], required: true},
  twoTier: {type: String, enum: ['Y', 'N'], required: true}
})

const schema = new Schema({
    submeasureId: {type: Number, required: true},
    moduleId: {type: Number, required: true},
    name: {type: String, required: true},
    desc: {type: String, required: true},
    sourceId: {type: Number, required: true},
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
    categoryType: String,
    groupingSubmeasureId: Number,
    status: {type: String, enum: ['A', 'I', 'P'], required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {
    collection: 'dfa_submeasure'
  });

@injectable()
export default class SubmeasureRepo extends RepoBase {
  autoIncrementField = 'submeasureId';

  constructor() {
    super(schema, 'Submeasure', true);
  }

  getGroupingSubmeasures(measureId): Promise<GroupingSubmeasure[]> {
    return this.Model.find({measureId, 'indicators.groupFlag': 'Y'}, {_id: 0, submeasureId: 1, name: 1})
      .then(docs => docs.map(doc => {
        return {submeasureName: doc.name, submeasureId: doc.submeasureId};
      }));
  }

}

