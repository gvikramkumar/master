import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ScmsTriangulationUploadRepo from './repo';
import {ScmsTriangulationUploadPgRepo} from './pgrepo';


@injectable()
export default class ScmsTriangulationUploadController extends ControllerBase {
  constructor(repo: ScmsTriangulationUploadRepo, pgRepo: ScmsTriangulationUploadPgRepo) {
    super(repo, pgRepo);
  }

}
