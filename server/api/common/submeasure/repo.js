const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base');

const schema = new mg.Schema(
  {
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

module.exports = class SubmeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Submeasure');
  }

}

