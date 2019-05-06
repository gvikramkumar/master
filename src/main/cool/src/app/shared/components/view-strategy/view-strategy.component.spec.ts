import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStrategyComponent } from './view-strategy.component';

describe('ViewStrategyComponent', () => {
  let component: ViewStrategyComponent;
  let fixture: ComponentFixture<ViewStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
