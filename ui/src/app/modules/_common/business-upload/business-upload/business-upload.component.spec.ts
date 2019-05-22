import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUploadComponent } from './business-upload.component';

xdescribe('BusinessUploadComponent', () => {
  let component: BusinessUploadComponent;
  let fixture: ComponentFixture<BusinessUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
