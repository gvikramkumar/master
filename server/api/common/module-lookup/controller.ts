import {injectable} from 'inversify';
import {ApiError} from '../../../lib/common/api-error';
import ModuleLookupRepo from './repo';


@injectable()
export default class ModuleLookupController {

  constructor(private repo: ModuleLookupRepo) {
  }

  getValue(req, res, next) {
    if (!req.query.moduleId) {
      next(new ApiError('moduleId required', null, 400));
      return Promise.resolve();
    }
    return this.repo.getDoc(req.query.moduleId, req.params.key)
      .then(item => {
        if (!item) {
          if (req.query.noerror) {
            res.status(204).end();
          } else {
            next(new ApiError('Item not found.', null, 404));
            return;
          }
        } else {
          res.json(item.value);
        }
      })
      .catch(next);
  }

  add(req, res, next) {
    this.repo.add(req.body)
      .then(item => res.json(item))
      .catch(next);
  }

  update(req, res, next) {
    const data = req.body;
    this.repo.update(data)
      .then(item => {
        res.json(item);
      })
      .catch(next);
  }

  remove(req, res, next) {
    if (!req.query.moduleId) {
      next(new ApiError('moduleId required', null, 400));
      return Promise.resolve();
    }
    this.repo.remove(req.query.moduleId, req.params.key)
      .then(item => res.json(item))
      .catch(next);
  }

}

