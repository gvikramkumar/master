import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PirateShipLegendComponent } from './pirate-ship-legend.component';

describe('PirateShipLegendComponent', () => {
  let component: PirateShipLegendComponent;
  let fixture: ComponentFixture<PirateShipLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PirateShipLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PirateShipLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
