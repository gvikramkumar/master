import { TestBed } from '@angular/core/testing';
import { BkgmModule } from './bkgm.module';
describe('BkgmModule', () => {
  let pipe: BkgmModule;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BkgmModule] });
    pipe = TestBed.get(BkgmModule);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
