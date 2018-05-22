const OpenPeriodRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base');

const repo = new OpenPeriodRepo();

module.exports = class OpenPeriodController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

