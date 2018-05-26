const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base');


const schema = new mg.Schema(
  {
    name: {type: String, required: true},
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'rev_classification'}
);

module.exports = class RevClassificationRepo extends RepoBase {
  constructor() {
    super(schema, 'RevClassification');
  }
}

