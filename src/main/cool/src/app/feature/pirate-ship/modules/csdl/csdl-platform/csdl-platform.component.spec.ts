import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsdlPlatformComponent } from './csdl-platform.component';

describe('CsdlPlatformComponent', () => {
  let component: CsdlPlatformComponent;
  let fixture: ComponentFixture<CsdlPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsdlPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsdlPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
