import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllocationRule} from '../../models/allocation-rule';
import {RuleService} from '../../services/rule.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../shared/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import {Submeasure} from '../../models/submeasure';
import * as _ from 'lodash';
import AnyObj from '../../../../../../../shared/models/any-obj';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-edit.component.html',
  styleUrls: ['./rule-management-edit.component.scss']
})
export class RuleManagementEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  rule = new AllocationRule();
  orgRule = _.cloneDeep(this.rule);
  title: string;
  periodSelection = 0;
  driverSelection = 0;
  salesMatch = 0;
  productMatch = 0;
  scmsMatch = 0;
  legalMatch = 0;
  beMatch = 0;
  sl1Select = '';
  scmsSelect = '';
  beSelect = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private store: AppStore
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  public ngOnInit(): void {
    if (this.editMode) {
      this.title = 'Edit Rule';
      this.ruleService.getOneById(this.route.snapshot.params.id)
        .subscribe(rule => {
          this.rule = rule;
          this.orgRule = _.cloneDeep(this.rule);
          this.init();
        });
    } else {
      this.title = 'Create Rule';
    }
  }

  init() {
    this.driverSelection = this.rule.driverName? this.driverNamesMap[this.rule.driverName]: '';
    this.periodSelection = this.rule.period? this.periodNamesMap[this.rule.period]: '';
    this.salesMatch = this.rule.salesMatch? this.salesLevelsMap[this.rule.salesMatch]: '';
    this.productMatch = this.rule.productMatch? this.productLevelsMap[this.rule.productMatch]: '';
    this.scmsMatch = this.rule.scmsMatch? this.scmsLevelsMap[this.rule.scmsMatch]: '';
    this.legalMatch = this.rule.legalEntityMatch? this.legalLevelsMap[this.rule.legalEntityMatch]: '';
    this.beMatch = this.rule.beMatch? this.beLevelsMap[this.rule.beMatch]: '';
    this.sl1Select = this.rule.sl1Select;
    this.scmsSelect = this.rule.scmsSelect;
    this.beSelect = this.rule.beSelect;
    this.formChange();
  }

  driverNamesAbbrev = ['GLREVMIX', 'MANUALMAP', 'REVPOS', 'SERVMAP', 'SHIPMENT', 'SHIPREV', 'VIP'];
  driverNamesMap: AnyObj = {
    'GLREVMIX':1,
    'MANUALMAP':2,
    'REVPOS':3,
    'SERVMAP':4,
    'SHIPMENT':5,
    'SHIPREV':6,
    'VIP':7
  }

  periodNamesMap: AnyObj = {
    'MTD':1,
    'ROLL6':2,
    'ROLL3':3
  }

  salesLevelsMap: AnyObj = {
    'SL1':1,
    'SL2':2,
    'SL3':3,
    'SL4':4,
    'SL5':5,
    'SL6':6
  }
  productLevelsMap: AnyObj = {
    'BU':1,
    'PF':2,
    'TG':3,
    'PID':4
  }
  scmsLevelsMap: AnyObj = {
    'SCMS':1
  }
  legalLevelsMap: AnyObj = {
    'Business Entity':1
  }
  beLevelsMap: AnyObj = {
    'BE':1,
    'Sub BE':2
  }


  driverNames = [
    {
      name: 'GL Revenue Mix', //GLREVMIX
      value: 1,
    },
    {
      name: 'Manual Mapping', //MANUALMAP
      value: 2,
    },
    {
      name: 'POS Revenue', //REVPOS
      value: 3,
    },
    {
      name: 'Service Map', //SERVMAP
      value: 4,
    },
    {
      name: 'Shipment', //SHIPMENT
      value: 5,
    },
    {
      name: 'Shipped Revenue', //SHIPREV
      value: 6,
    },
    {
      name: 'VIP Rebates', //VIP
      value: 7,
    }
  ]

  driverPeriods = [
    {
      name: 'MTD',
      value: 1,
    },
    {
      name: 'ROLL6',
      value: 2,
    },
    {
      name: 'ROLL3',
      value: 3,
    }
  ]

  salesLevels = [
    {
      name: 'SL1',
      value: 1,
    },
    {
      name: 'SL2',
      value: 2,
    },
    {
      name: 'SL3',
      value: 3,
    },
    {
      name: 'SL4',
      value: 4,
    },
    {
      name: 'SL5',
      value: 5,
    },
    {
      name: 'SL6',
      value: 6,
    }
  ]

  productLevels = [
    {
      name: 'BU',
      value: 1,
    },
    {
      name: 'PF',
      value: 2,
    },
    {
      name: 'TG',
      value: 3,
    },
    {
      name: 'PID',
      value: 4,
    }
  ]

  scmsLevels = [
    {
      name: 'SCMS',
      value: 1,
    }
  ]

  legalEntityLevels = [
    {
      name: 'Business Entity',
      value: 1,
    }
  ]

  ibeLevels = [
    {
      name: 'BE',
      value: 1,
    },
    {
      name: 'Sub BE',
      value: 2,
    }
  ]

  formChange() {
    if(this.periodSelection && this.driverPeriods[this.periodSelection-1].name != null) {
      this.rule.period = this.driverPeriods[this.periodSelection-1].name;
    }
    else {
      this.rule.period = '';
    }
    if(this.driverSelection && this.driverNamesAbbrev[this.driverSelection-1] != null) {
      this.rule.driverName = this.driverNamesAbbrev[this.driverSelection-1];
    }
    else {
      this.rule.driverName = '';
    }
    if(this.salesMatch && this.salesLevels[this.salesMatch-1].name != null) {
      this.rule.salesMatch = this.salesLevels[this.salesMatch-1].name;
    }
    else {
      this.rule.salesMatch = '';
    }
    if (this.productMatch && this.productLevels[this.productMatch-1].name != null) {
      this.rule.productMatch = this.productLevels[this.productMatch-1].name;
    }
    else {
      this.rule.productMatch = '';
    }
    if (this.scmsMatch && this.scmsLevels[this.scmsMatch-1].name != null) {
      this.rule.scmsMatch = this.scmsLevels[this.scmsMatch-1].name;
    }
    else {
      this.rule.scmsMatch = '';
    }
    if (this.legalMatch && this.legalEntityLevels[this.legalMatch-1].name != null) {
      this.rule.legalEntityMatch = this.legalEntityLevels[this.legalMatch-1].name;
    }
    else {
      this.rule.legalEntityMatch = '';
    }
    if (this.beMatch && this.ibeLevels[this.beMatch-1].name != null) {
      this.rule.beMatch = this.ibeLevels[this.beMatch-1].name;
    }
    else {
      this.rule.beMatch = '';
    }

    if (this.sl1Select.length > 0) {
      this.rule.sl1Select = this.sl1Select;
    }
    else {
      this.rule.sl1Select = '';
    }
    if (this.scmsSelect.length > 0) {
      this.rule.scmsSelect = this.scmsSelect;
    }
    else {
      this.rule.scmsSelect = '';
    }
    if (this. beSelect.length > 0) {
      this.rule.beSelect = this.beSelect;
    }
    else {
      this.rule.beSelect = '';
    }
  }

  hasChanges() {
    return !_.isEqual(this.rule, this.orgRule);
  }

  verifyLosingChanges() {
    if (this.hasChanges()) {
      alert('Are you sure you want to lose your changes?');
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  cancel() {
    this.verifyLosingChanges()
      .then(() => this.router.navigateByUrl('/prof/rule-management'));
  }

  reset() {
    this.verifyLosingChanges()
      .then(() => {
        if (this.editMode) {
          this.rule = _.cloneDeep(this.orgRule);
        } else {
          this.rule = new AllocationRule();
        }
        this.init();
      });
  }



  public save() {
    this.formChange();

    this.validate()
      .subscribe(valid => {
        if (valid) {
          this.ruleService.add(this.rule)
            .subscribe(rule => this.router.navigateByUrl('/prof/rule-management'));
        }
      })
  }

  validate(): Observable<boolean> {
    //todo: need to search for rule name duplicity on add only
    let obs: Observable<AllocationRule>;
    if (this.editMode) {
      return of(true);
    } else {
      //todo: validate name doesn't exist already. Could be done with an ngModel validator realtime if rules cached
      // otherwise hit server here
      // check for fule name existence in store (if cached rules) or hit the server (why it's observable)
      return of(true);
    }
  }
}
