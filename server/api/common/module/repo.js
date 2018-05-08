const mg = require('mongoose'),
  RepoBase = require('../../../lib/models/repo-base');

const schema = new mg.Schema(
  {
    seqnum: {type: Number, required: true},
    name: {type: String, required: true}
  },
  {collection: 'module'}
);

module.exports = class ModuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Module');
  }
}
