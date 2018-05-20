const AllocationRuleRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base');

const repo = new AllocationRuleRepo();

module.exports = class AllocationRuleController extends ControllerBase {
  constructor() {
    super(repo);
  }

  getMany(req, res, next) {
    if (req.query.getLatest) {
      this.repo.getManyByGroupLatest({}, 'name', req.query.yearmo, req.query.upperOnly)
        .then(items => res.send(items))
        .catch(next);

    } else {
      super.getMany(req, res, next);
    }
  }

}

