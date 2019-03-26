import {injectable} from 'inversify';
import {ApiError} from '../../../lib/common/api-error';
import ModuleLookupRepo from './repo';


@injectable()
export default class ModuleLookupController {

  constructor(private repo: ModuleLookupRepo) {
  }

  handleGetMany(req, res, next) {
    if (req.query.moduleId && req.query.keys) {
      this.getManyValuesOneModule(req, res, next);
    } else if (req.query.key && req.query.moduleIds) {
      this.getOneValueManyModules(req, res, next);
    } else {
      throw new ApiError('ModuleLookup getMany called with bad parameters', null, 400);
    }
  }

  // moduleId/keys >> {key, value} each key is a property in the object, no prop if no value (json.stringify)
  getManyValuesOneModule(req, res, next) {
    this.repo.getManyValuesOneModule(req.query.moduleId, req.query.keys.split(','))
      .then(obj => res.json(obj))
      .catch(next);
  }

  // key/moduleIds >> {moduleId, value}[]
  getOneValueManyModules(req, res, next) {
    this.repo.getOneValueManyModules(req.query.key, req.query.moduleIds.split(',').map(m => Number(m)))
      .then(objs => res.json(objs))
      .catch(next);
  }

  getValue(req, res, next) {
    if (!req.query.moduleId) {
      next(new ApiError('moduleId required', null, 400));
      return Promise.resolve();
    }
    return this.repo.getOne(req.query.moduleId, req.params.key)
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

  upsertMany(req, res, next) {
    const dataArr = req.body;
    this.repo.upsertMany(dataArr)
      .then(items => {
        res.json(items);
      })
      .catch(next);
  }

  upsert(req, res, next) {
    const data = req.body;
    this.verifyProperties(data, ['moduleId', 'key']);
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
    return this.repo.getOne(req.query.moduleId, req.params.key)
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
    const missingProps = [];
    arr.forEach(prop => {
      if (!data[prop]) {
        missingProps.push(prop);
      }
    });
    if (missingProps.length) {
      throw new ApiError(`Properties missing: ${missingProps.join(', ')}.`, data, 400);
    }
  }

}

