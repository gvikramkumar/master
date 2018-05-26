const OpenPeriodRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base');

const repo = new OpenPeriodRepo();

module.exports = class OpenPeriodController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

