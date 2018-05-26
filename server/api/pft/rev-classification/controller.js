const RevClassificationRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base');

const repo = new RevClassificationRepo();

module.exports = class RevClassificationController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

