import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OffersolutioningCardOneComponent } from './offer-solutioning-card-one.component';

describe('OffersolutioningCardOneComponent', () => {
  let component: OffersolutioningCardOneComponent;
  let fixture: ComponentFixture<OffersolutioningCardOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersolutioningCardOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersolutioningCardOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
