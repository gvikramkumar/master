import DeptUploadController from './controller';
import {injector} from '../../../../lib/common/inversify.config';


describe('upload/dept tests', () => {
  let sut;

  beforeAll(() => {
    sut = injector.get(DeptUploadController);
  });



})
