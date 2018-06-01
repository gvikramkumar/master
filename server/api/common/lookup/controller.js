const LookupRepo = require('./repo');

const repo = new LookupRepo();

module.exports = class LookupController {

  getValues(req, res, next) {
    repo.getValuesByType(req.params.type)
      .then(values => res.send(values))
      .catch(next);
  }

}

