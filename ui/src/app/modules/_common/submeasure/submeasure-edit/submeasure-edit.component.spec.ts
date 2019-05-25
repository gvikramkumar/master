import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SubmeasureEditComponent} from './submeasure-edit.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {AppRoutingModule} from '../../../../app/app-routing.module';
import {ActivatedRoute} from '@angular/router';


fdescribe('SubmeasureEditComponent', () => {
  let comp: SubmeasureEditComponent;
  let fixture: ComponentFixture<SubmeasureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SharedModule,
        AppRoutingModule
      ],
      declarations: [SubmeasureEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                mode: 'add'
              },
              data: {
                authorization: 'profitability allocations:business admin, profitability allocations:super user',
                hero: {
                  title: 'Add a New Sub-Measure',
                  desc: 'Add new sub-measure'
                },
                breadcrumbs: [{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/prof/submeasure'}, {label: 'Add New'}]

              }
            }
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmeasureEditComponent);
    comp = fixture.componentInstance;
  });

  it('should not call ngOnInit if fixture.detectChanges() is not called', () => {
    expect(comp.effectiveMonthNotRequired).toBe(true);
  });
});
