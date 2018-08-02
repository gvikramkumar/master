import {injectable} from 'inversify';
import PostgresControllerBase from '../../../lib/base-classes/pg-controller-base';
import {PgSourceMappingRepo} from './repo';
import {ModuleRepo} from '../module/repo';
import * as _ from 'lodash';
import SourceRepo from '../source/repo';
import {ApiError} from '../../../lib/common/api-error';
import {SourceMapping} from '../../../../shared/models/source-mapping';


@injectable()
export class SourceMappingController extends PostgresControllerBase {

  constructor(
    protected repo: PgSourceMappingRepo,
    private moduleRepo: ModuleRepo,
    private sourceRepo: SourceRepo
  ) {
    super(repo);
  }

  getModuleSourceArray(req, res, next) {
    return Promise.all([
      this.moduleRepo.getActiveNonAdminSortedByDisplayName(),
      this.repo.getMany()
    ])
      .then(results => {
        const modules = results[0];
        const rows = results[1];
        const rtn = modules.map(module => {
          return {
            moduleId: module.moduleId,
            sources: _.filter(rows, {moduleId: module.moduleId}).map(r => r.sourceId)
          };
        });
        res.json(rtn);
      })
      .catch(next);
  }

  updateModuleSourceArray(req, res, next) {

    const promiseArr = [];
    this.sourceRepo.getManyActive()
      .then(sources => {

        const arr: SourceMapping[] = req.body;
        arr.forEach(mapping => {
          const updateArr = [];
          mapping.sources.forEach(sourceId => {
            const source = _.find(sources, {sourceId})
            if (!source) {
              throw new ApiError(`updateModuleSourceArray: failed to find source for sourceId ${sourceId}`);
            }
            updateArr.push(this.repo.createRecord(mapping.moduleId, source));
          }); // mapping.sources.forEach

          promiseArr.push(
            this.repo.syncRecordsQueryOne(
              {moduleId: mapping.moduleId},
              ['moduleId', 'sourceId'],
              updateArr,
              req.user.id,
              false));

        }); // mapping.forEach
        return Promise.all(promiseArr)
          .then(() => res.end());
      }) // getsources.then
      .catch(next);

  }

}

