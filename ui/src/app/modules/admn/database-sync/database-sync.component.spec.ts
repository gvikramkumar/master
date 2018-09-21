import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSyncComponent } from './database-sync.component';

describe('DatabaseSyncComponent', () => {
  let component: DatabaseSyncComponent;
  let fixture: ComponentFixture<DatabaseSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
