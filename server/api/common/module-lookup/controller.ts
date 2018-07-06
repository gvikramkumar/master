import {injectable} from 'inversify';
import {ApiError} from '../../../lib/common/api-error';
import ModuleLookupRepo from './repo';


@injectable()
export default class ModuleLookupController {

  constructor(private repo: ModuleLookupRepo) {
  }

  // we get all in array and put as properties of an object
  getMany(req, res, next) {
    if (!req.query.moduleId) {
      next(new ApiError('moduleId required', null, 400));
      return Promise.resolve();
    }
    this.repo.getMany(req.query.moduleId, req.query.keys.split(','))
      .then(docs => {
        const obj = {};
        docs.forEach(doc => obj[doc.key] = doc.value);
        res.json(obj);
      });
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
    const data = req.body;
    this.verifyProperties(data, ['moduleId', 'key']);
    this.repo.add(data)
      .then(item => res.json(item))
      .catch(next);
  }

  upsert(req, res, next) {
    const data = req.body;
    this.verifyProperties(data, ['moduleId', 'key']);
    if (!data.moduleId) {
      next(new ApiError('moduleId required', null, 400));
    }
    this.repo.upsert(data)
      .then(item => {
        res.json(item);
      })
      .catch(next);
  }

  remove(req, res, next) {
    if (!req.query.moduleId) {
      next(new ApiError('moduleId required', null, 400));
    }
    return this.repo.getDoc(req.query.moduleId, req.params.key)
      .then(item => {
        if (!item) {
          res.status(204).end();
        } else {
          this.repo.remove(item)
            .then(val => res.json(val));
        }
      })
      .catch(next);
  }



  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400);
      }
    });
  }

}

