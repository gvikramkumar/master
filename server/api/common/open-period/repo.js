const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base');


const schema = new mg.Schema(
  {
    fiscalMonth: {type: Number, required: true},
    openFlag: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'dfa_open_period'}
);

module.exports = class OpenPeriodRepo extends RepoBase {
  constructor() {
    super(schema, 'OpenPeriod');
  }
}

