import { TestBed } from '@angular/core/testing';
import { BkgmRoutingModule } from './bkgm-routing.module';
describe('BkgmRoutingModule', () => {
  let pipe: BkgmRoutingModule;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BkgmRoutingModule] });
    pipe = TestBed.get(BkgmRoutingModule);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
