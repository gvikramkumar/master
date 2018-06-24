import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import ModuleRepoBase from '../../../lib/base-classes/module-repo-base';


const schema = new Schema(
  {
    moduleId: {type: Number, required: true},
    name: String,
    description: String,
    source: {type: String, enum: ['manual']},
    measureName: String,
    startFiscalMonth: Number,
    endFiscalMonth: Number,
    processingTime: {type: String, enum: ['Monthly']},
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
      discountFlag: {type: String, enum: ['Y', 'N']},
      approveFlag: {type: String, enum: ['Y', 'N']},
      status: {type: String, enum: ['A']},
      manualMapping: {type: String, enum: ['Y', 'N']},
      expenseSSOT: {type: String, enum: ['Y', 'N']},
      manualMix: {type: String, enum: ['Y', 'N']}
    },
    rules: [String]
  },
  {collection: 'dfa_submeasure'}
);

@injectable()
export default class SubmeasureRepo extends ModuleRepoBase {
  constructor() {
    super(schema, 'Submeasure');
  }

}

