import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoAtoListComponent } from './sso-ato-list.component';

describe('SsoAtoListComponent', () => {
  let component: SsoAtoListComponent;
  let fixture: ComponentFixture<SsoAtoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoAtoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoAtoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
