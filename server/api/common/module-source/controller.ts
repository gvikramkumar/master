import {injectable} from 'inversify';
import ModuleSourceRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {ApiError} from '../../../lib/common/api-error';
import SourceRepo from '../source/repo';
import AnyObj from '../../../../shared/models/any-obj';
import * as _ from 'lodash';
import {ModuleSourcePgRepo} from './pgrepo';

interface ModuleSourceMapping {
  moduleId: number;
  sources: number[];
}

@injectable()
export class ModuleSourceController extends ControllerBase {
  constructor(
    repo: ModuleSourceRepo,
    pgRepo: ModuleSourcePgRepo,
    private sourceRepo: SourceRepo
  ) {
    super(repo);
  }

  // do source and module_source here >> dfa_data_sources
  mongoToPgSync(userId, log: string[]) {
    const tableName = 'dfa_data_sources';
    try {
      const promiseArr = [];
      Promise.all([
        this.repo.getMany(),
        this.sourceRepo.getManyActive()
      ])
        .then(results => {
          const moduleSources: ModuleSourceMapping[] = results[0];
          const sources = results[1];
          const records: AnyObj[] = [];
          moduleSources.forEach(ms => {
            ms.sources.forEach(sourceId => {
              const source = _.find(sources, {sourceId});
              if (!source) {
                log.push(`No source found for sourceId: ${source.sourceId}`);
                return;
              }
              records.push(this.createRecord(ms.moduleId, source));
            });
          });
          return this.pgRepo.syncRecordsReplaceAll({}, records, userId);
        });
    } catch (err) {
      log.push(`${tableName}: ${err.message}`);
    }
  }

  createRecord(moduleId, source) {
    return {
      moduleId,
      sourceId: source.sourceId,
      sourceName: source.name,
      sourceTypeCode: source.typeCode,
      sourceStatus: source.status
    };
  }

}

