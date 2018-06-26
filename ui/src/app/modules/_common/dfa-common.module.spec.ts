import { DfaCommonModule } from './dfa-common.module';

describe('DfaCommonModule', () => {
  let dfaCommonModule: DfaCommonModule;

  beforeEach(() => {
    dfaCommonModule = new DfaCommonModule();
  });

  it('should create an instance', () => {
    expect(dfaCommonModule).toBeTruthy();
  });
});
