import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    sourceId: {type: Number, required: true},
    measureId: {type: Number, required: true},
    startFiscalMonth: Number,
    endFiscalMonth: Number,
    processingTime: {type: String},
    pnlnodeGrouping: String,
    inputFilterLevel: {
      productLevel: {type: String, enum: ['PF', 'BU', 'TG', 'PID']},
      salesLevel: String,
      scmsLevel: String,
      internalBELevel: String,
      entityLevel: String
    },
    manualMapping: {
      productLevel: {type: String, enum: ['PF', 'BU', 'TG', 'PID']},
      salesLevel: String,
      scmsLevel: String,
      internalBELevel: String,
      entityLevel: String
    },
    reportingLevels: [String],
    indicators: {
      dollarUploadFlag: {type: String, enum: ['Y', 'N']},
      approveFlag: {type: String, enum: ['Y', 'N']},
      status: {type: String, enum: ['A']},
      manualMapping: {type: String, enum: ['Y', 'N']},
      expenseSSOT: {type: String, enum: ['Y', 'N']},
      manualMix: {type: String, enum: ['Y', 'N']}
    },
    rules: [String],
    categoryType: String,
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    updatedBy: {type: String, required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_submeasure'}
);

@injectable()
export default class SubmeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Submeasure', true);
  }

}

