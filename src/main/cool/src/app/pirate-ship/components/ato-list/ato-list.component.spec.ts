import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoListComponent } from './ato-list.component';

describe('AtoListComponent', () => {
  let component: AtoListComponent;
  let fixture: ComponentFixture<AtoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
