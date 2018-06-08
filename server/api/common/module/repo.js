const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base');

const schema = new mg.Schema(
  {
    seqnum: {type: Number, required: true},
    name: {type: String, required: true}
  },
  {collection: 'dfa_module'}
);

module.exports = class ModuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Module');
  }
}
