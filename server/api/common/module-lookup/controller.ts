import {injectable} from 'inversify';
import ModuleLookupRepo from './repo';


@injectable()
export default class ModuleLookupController {

  constructor(private repo: ModuleLookupRepo) {}

  getValues(req, res, next) {
    this.repo.getValuesByType(req.query.moduleId, req.params.type)
      .then(values => res.send(values))
      .catch(next);
  }

}

