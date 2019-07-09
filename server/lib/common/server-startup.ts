import LookupRepo from '../../api/lookup/repo';
import config from '../../config/get-config';
import {finRequest} from './fin-request';
import {shUtil} from '../../../shared/misc/shared-util';
import _ from 'lodash';
import {injectable} from 'inversify';
import {dfaJobs} from '../../api/run-job/controller';


@injectable()
export class ServerStartup {
  // jobs = dfaJobs.filter(x => x.singleServer);
  singleServerJobs = dfaJobs.filter(x => x.singleServer);
  multipleServerJobs = dfaJobs.filter(x => !x.singleServer);

  constructor(private lookupRepo: LookupRepo) {
  }

}






