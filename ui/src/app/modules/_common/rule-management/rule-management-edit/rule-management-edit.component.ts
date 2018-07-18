import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllocationRule} from '../../models/allocation-rule';
import {RuleService} from '../../services/rule.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import * as _ from 'lodash';
import {DialogType} from '../../../../core/models/ui-enums';
import {UiUtil} from '../../../../core/services/ui-util';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-edit.component.html',
  styleUrls: ['./rule-management-edit.component.scss']
})
export class RuleManagementEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  rule = new AllocationRule();
  orgRule = _.cloneDeep(this.rule);
  driverNames = [
    {name: 'GL Revenue Mix', value: 'GLREVMIX'},
    {name: 'Manual Mapping', value: 'MANUALMAP'},
    {name: 'POS Revenue', value: 'REVPOS'},
    {name: 'Service Map', value: 'SERVMAP'},
    {name: 'Shipment', value: 'SHIPMENT'},
    {name: 'Shipped Revenue', value: 'SHIPREV'},
    {name: 'VIP Rebates', value: 'VIP'},
  ]
  periods = ['MTD', 'ROLL6', 'ROLL3'];
  salesMatches = ['SL1', 'SL2', 'SL3', 'SL4', 'SL5', 'SL6'];
  productMatches = ['BU', 'PF', 'TG', 'PID'];
  scmsMatches = ['SCMS'];
  legalEntityMatches = ['Business Entity'];
  legalEntityLevels = ['Business Entity'];
  beMatches = ['BE', 'Sub BE'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private store: AppStore,
    private uiUtil: UiUtil
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  public ngOnInit(): void {
    if (this.editMode) {
      this.ruleService.getOneById(this.route.snapshot.params.id)
        .subscribe(rule => {
          this.rule = rule;
          this.orgRule = _.cloneDeep(this.rule);
          this.init();
        });
    } else {
    }
  }

  init() {

  }

  hasChanges() {
    return !_.isEqual(this.rule, this.orgRule);
  }

  verifyLosingChanges() {
    if (this.hasChanges()) {
      return this.uiUtil.genericDialog('Are you sure you want to lose your changes?', DialogType.yesNo);
    } else {
      return of(true);
    }
  }

  cancel() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          this.router.navigateByUrl('/prof/rule-management');
        }
      });
  }

  reset() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          if (this.editMode) {
            this.rule = _.cloneDeep(this.orgRule);
          } else {
            this.rule = new AllocationRule();
          }
          this.init();
        }
      });
  }

  confirmSave() {
    return this.uiUtil.genericDialog('Are you sure you want to save?', DialogType.yesNo);
  }

  public save() {
    this.confirmSave()
      .subscribe(resp => {
        if (resp) {
          this.validate()
            .subscribe(valid => {
              if (valid) {
                this.ruleService.add(this.rule)
                  .subscribe(rule => this.router.navigateByUrl('/prof/rule-management'));
              }
            });
        }
      });
  }

  validate(): Observable<boolean> {
    // todo: need to search for rule name duplicity on add only
    if (this.editMode) {
      return of(true);
    } else {
      // todo: validate name doesn't exist already. Could be done with an ngModel validator realtime if rules cached
      // otherwise hit server here
      // check for fule name existence in store (if cached rules) or hit the server (why it's observable)
      return of(true);
    }
  }
}
