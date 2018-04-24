const mg = require('mongoose'),
  RepoBase = require('../../../lib/common/repo-base');

const schema = new mg.Schema(
  {
    key: {type: Number, required: true},
    name: {type: String, required: true}
  },
  {collection: 'submeasure_list'}
);

module.exports = class SubmeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Submeasure');
  }
}
