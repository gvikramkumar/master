import {SubmeasureEditComponent} from './submeasure-edit.component';
import _ from 'lodash';
import {ActivatedRouteMock} from '../../../../../../spec/mocks/activated-route';
import {AppStore} from '../../../../app/app-store';

fdescribe('SubmeasureEditComponent', () => {
  let comp: SubmeasureEditComponent;

  beforeEach(() => {
    const activatedRouteMock = new ActivatedRouteMock()
      .setParams({mode: 'add'})
      .setAuthorization(`profitability allocations:business admin, profitability allocations:super user`)
      .setHero({
        title: 'Update Sub-Measure',
        desc: 'Update the selected sub-measure'
      })
      .setBreadcrumbs([{label: 'Home', routerUrl: '/'}, {label: 'Sub-Measure', routerUrl: '/prof/submeasure'}, {label: 'Update'}]);
    comp = new SubmeasureEditComponent(
      <any>activatedRouteMock,
      <any>{},
      <any>{},
      <any>{},
      new AppStore(),
      <any>{},
      <any>{},
      <any>{},
      <any>{},
      <any>{},
      <any>{},
      <any>{}
      );
   });

  it('should cleanup empty rules', () => {
    comp.sm.rules = [];
    comp.arrRules = _.cloneDeep(comp.sm.rules);
    comp.cleanupRules();
    expect(comp.sm.rules.length).toBe(0);
    comp.sm.rules = ['', '  '];
    comp.arrRules = _.cloneDeep(comp.sm.rules);
    comp.cleanupRules();
    expect(comp.sm.rules.length).toBe(0);
    comp.sm.rules = ['', 'ONE-TWO-THREE', '  ', 'FOUR-FIVE-SIX'];
    comp.arrRules = _.cloneDeep(comp.sm.rules);
    comp.cleanupRules();
    expect(comp.sm.rules).toEqual(['ONE-TWO-THREE', 'FOUR-FIVE-SIX']);
  });

  it('getExistingArrRules tests', () => {
    expect(comp.getExistingArrRules()).toEqual([]);
    comp.arrRules = ['', '  '];
    expect(comp.getExistingArrRules()).toEqual([]);
    comp.arrRules = ['', '  ', 'RULE-ONE', 'RULE-TWO', '', '  '];
    expect(comp.getExistingArrRules()).toEqual(['RULE-ONE', 'RULE-TWO']);
  });


});
