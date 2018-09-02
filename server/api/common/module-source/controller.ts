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

  mongoToPgSyncTransform(moduleSources: ModuleSourceMapping[], userId, log) {
    return this.sourceRepo.getManyActive()
      .then(sources => {
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
        return records;
      });
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

