import {injectable} from 'inversify';
import PostgresControllerBase from '../../../lib/base-classes/pg-controller-base';
import {PostgresSourceMappingRepo} from './pgrepo';


@injectable()
export default class SourceMappingController extends PostgresControllerBase {
  constructor(repo: PostgresSourceMappingRepo) {
    super(repo);
  }
}

