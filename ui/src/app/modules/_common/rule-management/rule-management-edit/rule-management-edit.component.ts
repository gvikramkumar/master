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
          this.rule = results[5];
          this.orgRule = _.cloneDeep(this.rule);
          this.ruleNames = _.without(this.ruleNames, this.rule.name.toUpperCase());
        }
        this.init();

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

  cleanUp() {
    // clear out cond/choices if no match selected:
    // this should be handled via match selectChange events (which it's wired to), but they
    // don't trigger currently on empty click so do it here for now
    this.matchChange('sales');
    this.matchChange('product');
    this.matchChange('scms');
    this.matchChange('be');

    // if match selected and cond selected and not choices, clear out cond
    if (!this.rule.salesCritChoices.length) {
      this.rule.salesCritCond = undefined;
    }
    if (!this.rule.prodPFCritChoices.length) {
      this.rule.prodPFCritCond = undefined;
    }
    if (!this.rule.prodBUCritChoices.length) {
      this.rule.prodBUCritCond = undefined;
    }
    if (!this.rule.prodTGCritChoices.length) {
      this.rule.prodTGCritCond = undefined;
    }
    if (!this.rule.scmsCritChoices.length) {
      this.rule.scmsCritCond = undefined;
    }
    if (!this.rule.beCritChoices.length) {
      this.rule.beCritCond = undefined;
    }
  }

  saveToDraft() {
    this.uiUtil.confirmSave()
      .subscribe(result => {
        if (result) {
          this.cleanUp();
          this.ruleService.saveToDraft(this.rule)
            .subscribe(rule => this.router.navigateByUrl('/prof/rule-management'));
        }
      });
  }

  reject() {
    this.uiUtil.confirmSave()
      .subscribe(result => {
        if (result) {
          this.cleanUp();
          this.ruleService.reject(this.rule)
            .subscribe(rule => this.router.navigateByUrl('/prof/rule-management'));
        }
      });
  }

  save(mode: string) {
    UiUtil.triggerBlur('.fin-edit-container form');
    UiUtil.waitForAsyncValidations(this.form)
      .then(() => {
        if (this.form.valid) {
          this.uiUtil.confirmSave()
            .subscribe(result => {
              if (result) {
                this.cleanUp();
                let promise;
                switch (mode) {
                  case 'submit':
                    promise = this.ruleService.submitForApproval(this.rule).toPromise();
                    break;
                  case 'approve':
                    promise = this.ruleService.approve(this.rule).toPromise();
                    break;
                }
                promise.then(() => this.router.navigateByUrl('/prof/rule-management'));
              }
            });
        }
      });
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
        .pipe(map(results => {
          if (!results.exist) {
            return {prodPFChoices: {value: control.value}};
          } else {
            if (!_.isEqual(this.rule.prodPFCritChoices, results.values)) {
              this.rule.prodPFCritChoices = results.values;
            }
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
        .pipe(map(results => {
          if (!results.exist) {
            return {prodBUChoices: {value: control.value}};
          } else {
            if (!_.isEqual(this.rule.prodBUCritChoices, results.values)) {
              this.rule.prodBUCritChoices = results.values;
            }
            return null;
          }
        }));
    });
  }

  // this is what we want to do, i.e. clear out cond/choices when they clear match, but we don't get a
  // selectChange event on cui-select clear, even when setting emitSelection=true
  // we'll have to clear the fields on save() instead for now
  matchChange(type) {

    if (type === 'sales' && !this.rule.salesMatch) {
      this.rule.salesCritCond = undefined;
      this.rule.salesCritChoices = [];
    }
    if (type === 'product' && !this.rule.productMatch) {
      this.rule.prodPFCritCond = undefined;
      this.rule.prodBUCritCond = undefined;
      this.rule.prodTGCritCond = undefined;
      this.rule.prodPFCritChoices = [];
      this.rule.prodBUCritChoices = [];
      this.rule.prodTGCritChoices = [];
    }
    if (type === 'scms' && !this.rule.scmsMatch) {
      this.rule.scmsCritCond = undefined;
      this.rule.scmsCritChoices = [];
    }
    if (type === 'be' && !this.rule.beMatch) {
      this.rule.beCritCond = undefined;
      this.rule.beCritChoices = [];
    }
  }

}
