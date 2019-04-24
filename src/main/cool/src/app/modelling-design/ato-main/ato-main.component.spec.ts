import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoMainComponent } from './ato-main.component';

describe('AtoMainComponent', () => {
  let component: AtoMainComponent;
  let fixture: ComponentFixture<AtoMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
