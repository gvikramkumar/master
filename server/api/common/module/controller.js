const ModuleRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base');

const repo = new ModuleRepo();

module.exports = class ModuleController extends ControllerBase {
  constructor() {
    super(repo);
  }
}

