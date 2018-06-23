import mg, {Model, Schema} from 'mongoose';
import {NamedApiError} from '../common/named-api-error';
import _ from 'lodash';
import util from '../common/util';
import {ApiError} from '../common/api-error';
import AnyObj from '../models/any-obj';
import RepoBase from './repo-base';

export default class ModuleRepoBase extends RepoBase{
  protected Model: Model<any>;

  constructor(public schema: Schema, modelName: string) {
    super(schema, modelName);
  }

  getMany(filter: AnyObj = {}) {
    if (!filter.moduleId) {
      throw new ApiError('Missing moduleId', null, 400);
    } else {
      return super.getMany(filter);
    }
  }

  getManyByGroupLatest(filter: AnyObj = {}) {
    if (!filter.moduleId) {
      throw new ApiError('Missing moduleId', null, 400);
    } else {
      return super.getManyByGroupLatest(filter);
    }
  }

  getOneLatest(filter: AnyObj = {}) {
    if (!filter.moduleId) {
      throw new ApiError('Missing moduleId', null, 400);
    } else {
      return super.getOneLatest(filter);
    }
  }

  getOne(filter: AnyObj = {}) {
    if (!filter.moduleId) {
      throw new ApiError('Missing moduleId', null, 400);
    } else {
      return super.getOne(filter);
    }
  }

  addMany(docs, userId) {
    docs.forEach(doc => {
      if (!doc.moduleId) {
        throw new ApiError('Missing moduleId', null, 400);
      }
    })
    return super.addMany(docs, userId);
  }

  addManyTransaction(docs, userId) {
    docs.forEach(doc => {
      if (!doc.moduleId) {
        throw new ApiError('Missing moduleId', null, 400);
      }
    })
    return super.addManyTransaction(docs, userId);
  }

  addOne(data, userId) {
    if (!data.moduleId) {
      throw new ApiError('Missing moduleId', null, 400);
    } else {
      return super.addOne(data, userId);
    }
  }

}

