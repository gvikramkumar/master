import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfieldsComponent } from './editfields.component';

describe('EditfieldsComponent', () => {
  let component: EditfieldsComponent;
  let fixture: ComponentFixture<EditfieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditfieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
