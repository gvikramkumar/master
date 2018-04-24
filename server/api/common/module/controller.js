const ModuleRepo = require('./repo'),
  schema = require('./schema'),
  ControllerBase = require('../../../lib/common/controller-base');

const repo = new ModuleRepo();

module.exports = class ModuleController extends ControllerBase {
  constructor() {
    super(repo, schema);
  }
}

