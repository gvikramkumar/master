import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SubmeasureEditComponent} from './submeasure-edit.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {AppRoutingModule} from '../../../../app/app-routing.module';
import {ActivatedRoute} from '@angular/router';
import { Submeasure } from '../../../../../../spec/helpers/mock-data';
import _ from 'lodash';

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
    comp.sm = Submeasure;
    comp.arrRules = _.cloneDeep(comp.sm.rules);
  });

  it('should cleanup empty rules', () => {
    comp.sm.rules.splice(0, 0, '');
    comp.sm.rules.splice(2, 0, '');
    comp.sm.rules.push('');
    comp.cleanupRules();
    expect(comp.sm.rules.length).toEqual(2);
  });

  it('should check that the rules exist', () => {
    expect(comp.verifyRulesExist).toEqual(2);
  });


});
