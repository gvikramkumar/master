const mg = require('mongoose'),
  RepoBase = require('../../../lib/models/repo-base');

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
    inputfilterLevel: {
      productLevel: {type: String, enum: ['PF', 'BU', 'TG', 'PID']},
      salesLevel: String,
      scsmsLevel: String,
      internalBELevel: String,
      entityLevel: String
    },
    manualMapping: {
      productLevel: {type: String, enum: ['PF', 'BU', 'TG', 'PID']},
      salesLevel: String,
      scsmsLevel: String,
      internalBELevel: String,
      entityLevel: String
    },
    reportingLevels: [String],
    indicators: {
      dollaruploadFlag: {type: String, enum: ['Y', 'N']},
      discountFlag: {type: String, enum: ['Y', 'N']},
      approveFlag: {type: String, enum: ['Y', 'N']},
      status: {type: String, enum: ['A']},
      manualmapping: {type: String, enum: ['Y', 'N']}
    },
    revenueClassifications: [String],
    rules: [String]
  },
  {collection: 'submeasure'}
);

module.exports = class SubmeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Submeasure');
  }

}

