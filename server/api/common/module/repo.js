const mg = require('mongoose'),
  RepoBase = require('../../../lib/common/repo-base');

const schema = new mg.Schema(
  {
    name: {type: String, required: true}
  },
  {collection: 'modules'}
);

module.exports = class ModuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Module');
  }
}
