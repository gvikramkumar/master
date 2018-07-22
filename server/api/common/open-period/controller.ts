import {injectable} from 'inversify';
import OpenPeriodRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {PostgresRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {OpenPeriodPostgresRepo} from './pgrepo';


@injectable()
export default class OpenPeriodController extends ControllerBase {
  constructor(repo: OpenPeriodRepo, pgRepo: OpenPeriodPostgresRepo) {
    super(repo, pgRepo);
  }

}

