import { PrdtModule } from './prdt.module';

describe('PrdtModule', () => {
  let prdtModule: PrdtModule;

  beforeEach(() => {
    prdtModule = new PrdtModule();
  });

  it('should create an instance', () => {
    expect(prdtModule).toBeTruthy();
  });
});
