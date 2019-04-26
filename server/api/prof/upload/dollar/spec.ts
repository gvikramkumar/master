import {injector} from '../../../../lib/common/inversify.config';
import DollarUploadUploadController from './controller';
import DollarUploadRepo from '../../dollar-upload/repo';
import {mockRepo} from '../../../../../spec/mocks/mock-repo';


describe('upload/dollar tests', () => {
  let sut;
  beforeAll(() => {
    if (injector.isBound(DollarUploadRepo)) {
      console.log('>>>>>>>> unbind DollarUploadRepo');
      injector.unbind(DollarUploadRepo);
    }
    injector.bind(DollarUploadRepo).toConstantValue(mockRepo);

    sut = injector.get(DollarUploadUploadController);
  });

  it('should', () => {
    expect(sut).toBeDefined();
  });

})











