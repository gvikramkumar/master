import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {RuleService} from '../../services/rule.service';
import {PgLookupService} from '../../services/pg-lookup.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import * as _ from 'lodash';
import {DialogType} from '../../../../core/models/ui-enums';
import {UiUtil} from '../../../../core/services/ui-util';
import {AbstractControl, AsyncValidatorFn, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ValidationInputOptions} from '../../../../shared/components/validation-input/validation-input.component';
import {map} from 'rxjs/operators';
import {notInListValidator} from '../../../../shared/validators/not-in-list.validator';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-edit.component.html',
  styleUrls: ['./rule-management-edit.component.scss']
})
export class RuleManagementEditComponent extends RoutingComponentBase implements OnInit {
  ruleNames: string[] = [];
  nameOptions: ValidationInputOptions;
  prodPFChoiceOptions: ValidationInputOptions;
  prodBUChoiceOptions: ValidationInputOptions;
  @ViewChild('form') form: NgForm;
  UiUtil = UiUtil;
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
  ];
  periods = ['MTD', 'ROLL6', 'ROLL3'];
  conditionalOperators = ['IN', 'NOT IN'];
  salesMatches = ['SL1', 'SL2', 'SL3', 'SL4', 'SL5', 'SL6'];
  productMatches = ['BU', 'PF', 'TG']; // no PID
  scmsMatches = ['SCMS'];
  legalEntityMatches = ['Business Entity'];
  beMatches = ['BE', 'Sub BE'];

  // SELECT options to be taken from Postgres
  salesChoices: {name: string}[] = [];
  prodTgChoices: {name: string}[] = [];
  scmsChoices: {name: string}[] = [];
  internalBeChoices: {name: string}[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private pgLookupService: PgLookupService,
    private store: AppStore,
    public uiUtil: UiUtil
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  public ngOnInit(): void {
    const promises = [
      this.pgLookupService.getRuleCriteriaChoicesSalesLevel1().toPromise(),
      this.pgLookupService.getRuleCriteriaChoicesProdTg().toPromise(),
      this.pgLookupService.getRuleCriteriaChoicesScms().toPromise(),
      this.pgLookupService.getRuleCriteriaChoicesInternalBeBe().toPromise(),
      this.ruleService.getDistinctRuleNames().toPromise()
    ];
    if (this.editMode) {
      promises.push(this.ruleService.getOneById(this.route.snapshot.params.id).toPromise());
    }
      Promise.all(promises)
      .then(results => {
        // assign to your local arrays here, then:
        // map result string arrays to object arrays for use in dropdowns
        this.salesChoices = results[0].map(x => ({name: x}));
        this.prodTgChoices = results[1].map(x => ({name: x}));
        this.scmsChoices = results[2].map(x => ({name: x}));
        this.internalBeChoices = results[3].map(x => ({name: x}));
        this.ruleNames = results[4].map(x => x.toUpperCase());

        if (this.editMode) {
          this.rule = results[4];
          this.orgRule = _.cloneDeep(this.rule);
          this.ruleNames = _.without(this.ruleNames, this.rule.name);
        }
        this.init();

        this.nameOptions = {
          validations: [
            {
              name: 'notInList',
              message: 'Rule name already exists',
              fcn: notInListValidator(this.ruleNames)
            }
          ]
        };

        this.prodPFChoiceOptions = {
          asyncValidations: [
            {
              name: 'prodPFChoices',
              message: 'Some product PF select fields don\'t exist',
              fcn: this.prodPFChoicesValidator()
            }
          ]
        };

        this.prodBUChoiceOptions = {
          asyncValidations: [
            {
              name: 'prodBUChoices',
              message: 'Some product BU select fields don\'t exist',
              fcn: this.prodBUChoicesValidator()
            }
          ]
        };

      });
  }

  init() {
    // called to prepare ui for new rule, in onInit/reset
  }

  hasChanges() {
    return !_.isEqual(this.rule, this.orgRule);
  }

  verifyLosingChanges() {
    if (this.hasChanges()) {
      return this.uiUtil.genericDialog('Are you sure you want to lose your changes?', null, null, DialogType.yesNo);
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

  public save() {
    UiUtil.triggerBlur('.fin-edit-container form');
    if (this.form.valid) {
      this.uiUtil.confirmSave()
        .subscribe(valid => {
          if (valid) {
            this.ruleService.add(this.rule)
              .subscribe(rule => this.router.navigateByUrl('/prof/rule-management'));
          }
        });
    } else {
      console.log(this.form.valid, this.form.pending);
    }
  }

  requiredCond(select) {
    switch (select) {
      case 'sl1':
        if (this.rule.salesMatch && this.rule.salesCritChoices.length) {
          return true;
        }
        break;
      case 'pf':
        if (this.rule.productMatch && this.rule.prodPFCritChoices.length) {
          return true;
        }
        break;
      case 'bu':
        if (this.rule.productMatch && this.rule.prodBUCritChoices.length) {
          return true;
        }
        break;
      case 'tg':
        if (this.rule.productMatch && this.rule.prodTGCritChoices.length) {
          return true;
        }
        break;
      case 'scms':
        if (this.rule.scmsMatch && this.rule.scmsCritChoices.length) {
          return true;
        }
        break;
      case 'be':
        if (this.rule.beMatch && this.rule.beCritChoices.length) {
          return true;
        }
        break;
    }

    return false;
  }

  prodPFChoicesValidator(): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.value || !control.value.length) {
        return Promise.resolve(null);
      }
      return this.ruleService.validateProdPFCritChoices(control.value)
        .pipe(map(valid => {
          if (!valid) {
            return {prodPFChoices: {value: control.value}};
          } else {
            return null;
          }
        }));
    });
  }

  prodBUChoicesValidator(): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.value || !control.value.length) {
        return Promise.resolve(null);
      }
      return this.ruleService.validateProdBUCritChoices(control.value)
        .pipe(map(valid => {
          if (!valid) {
            return {prodBUChoices: {value: control.value}};
          } else {
            return null;
          }
        }));
    });
  }


}
