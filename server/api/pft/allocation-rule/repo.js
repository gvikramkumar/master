const mg = require('mongoose'),
  RepoBase = require('../../../lib/common/repo-base');

const schema = new mg.Schema(
  {
    name: {type: String, required: true},
    period: {type: String, required: true},
    driverName: {type: String, required: true},
    salesMatch: {type: String},
    productMatch: {type: String},
    scmsMatch: {type: String},
    legalEntityMatch: {type: String},
    beMatch: {type: String},
    sl1Select: {type: String},
    scmsSelect: {type: String},
    beSelect: {type: String},
    createdBy: {type: String},
    createdDate: {type: String},
    updatedBy: {type: String},
    updatedDate: {type: String}
  },
  {collection: 'allocation_rules'}
);

module.exports = class AllocationRuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Rule');
  }
}
