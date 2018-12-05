import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {RuleService} from '../../services/rule.service';
import {PgLookupService} from '../../services/pg-lookup.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import * as _ from 'lodash';
import {DialogInputType, DialogType} from '../../../../core/models/ui-enums';
import {UiUtil} from '../../../../core/services/ui-util';
import {AbstractControl, AsyncValidatorFn, NgForm, ValidationErrors} from '@angular/forms';
import {ValidationInputOptions} from '../../../../shared/components/validation-input/validation-input.component';
import {map} from 'rxjs/operators';
import {LookupService} from '../../services/lookup.service';
import AnyObj from '../../../../../../../shared/models/any-obj';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-edit.component.html',
  styleUrls: ['./rule-management-edit.component.scss']
})
export class RuleManagementEditComponent extends RoutingComponentBase implements OnInit {
  ruleNames: string[] = [];
  salesSL2ChoiceOptions: ValidationInputOptions;
  salesSL3ChoiceOptions: ValidationInputOptions;
  prodPFChoiceOptions: ValidationInputOptions;
  prodBUChoiceOptions: ValidationInputOptions;
  @ViewChild('form') form: NgForm;
  UiUtil = UiUtil;
  addMode = false;
  viewMode = false;
  editMode = false;
  copyMode = false;
  rule = new AllocationRule();
  orgRule = _.cloneDeep(this.rule);
  drivers: {name: string, value: string}[];
  periods: {period: string}[];

  conditionalOperators = [{operator: 'IN'}, {operator: 'NOT IN'}];
  salesMatches = [{match: 'SL1'}, {match: 'SL2'}, {match: 'SL3'}, {match: 'SL4'}, {match: 'SL5'}, {match: 'SL6'}];
  productMatches = [{match: 'BU'}, {match: 'PF'}, {match: 'TG'}]; // no PID
  scmsMatches = [{match: 'SCMS'}];
  legalEntityMatches = [{match: 'Business Entity'}];
  beMatches = [{match: 'BE'}, {match: 'Sub BE'}];
  sl1CondRequired = false;
  sl2CondRequired = false;
  sl3CondRequired = false;
  pfCondRequired = false;
  buCondRequired = false;
  tgCondRequired = false;
  scmsCondRequired = false;
  beCondRequired = false;

  // SELECT options to be taken from Postgres
  salesSL1Choices: { name: string }[] = [];
  prodTgChoices: { name: string }[] = [];
  scmsChoices: { name: string }[] = [];
  internalBeChoices: { name: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private pgLookupService: PgLookupService,
    private store: AppStore,
    public uiUtil: UiUtil,
    private lookupService: LookupService
  ) {
    super(store, route);
    if (!this.route.snapshot.params.mode) {
      throw new Error('Edit page called with no add/edit/copy mode');
    }
    this.addMode = this.route.snapshot.params.mode === 'add';
    this.viewMode = this.route.snapshot.params.mode === 'view';
    this.editMode = this.route.snapshot.params.mode === 'edit';
    this.copyMode = this.route.snapshot.params.mode === 'copy';
  }

  public ngOnInit(): void {
    const promises: Promise<any>[] = [
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l1_sales_territory_descr').toPromise(),
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_products', 'technology_group_id').toPromise(),
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code').toPromise(),
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_be_hierarchy', 'business_entity_descr').toPromise(),
      this.ruleService.getDistinctRuleNames().toPromise(),
      this.lookupService.getValues(['drivers', 'periods']).toPromise()
    ];
    if (this.viewMode || this.editMode || this.copyMode) {
      promises.push(this.ruleService.getOneById(this.route.snapshot.params.id).toPromise());
    }
    Promise.all(promises)
      .then(results => {
        // assign to your local arrays here, then:
        // map result string arrays to object arrays for use in dropdowns
        this.salesSL1Choices = results[0].map(x => ({name: x}));
        this.prodTgChoices = results[1].map(x => ({name: x}));
        this.scmsChoices = results[2].map(x => ({name: x}));
        this.internalBeChoices = results[3].map(x => ({name: x}));
        this.ruleNames = results[4].map(x => x.toUpperCase());
        this.drivers = _.sortBy(results[5][0], 'name');
        this.periods = results[5][1];

        if (this.viewMode || this.editMode || this.copyMode) {
          this.rule = results[6];
        }

        if (this.copyMode) {
          this.rule.approvedOnce = 'N';
          delete this.rule.createdBy;
          delete this.rule.createdDate;
          this.orgRule = _.cloneDeep(this.rule);
        }
        if (this.editMode) {
          if (_.includes(['A', 'I'], this.rule.status)) {
            delete this.rule.createdBy;
            delete this.rule.createdDate;
          }
          this.orgRule = _.cloneDeep(this.rule);
          this.ruleNames = _.without(this.ruleNames, this.rule.name.toUpperCase());
        }

        this.salesSL2ChoiceOptions = {
          asyncValidations: [
            {
              name: 'salesSL2Choices',
              message: 'Some sales SL2 select fields don\'t exist',
              fcn: this.salesSL2ChoicesValidator()
            }
          ]
        };

        this.salesSL3ChoiceOptions = {
          asyncValidations: [
            {
              name: 'salesSL3Choices',
              message: 'Some sales SL3 select fields don\'t exist',
              fcn: this.salesSL3ChoicesValidator()
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

        this.init();
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
          history.go(-1);
        }
      });
  }

  reset() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          this.rule = _.cloneDeep(this.orgRule);
          this.init();
        }
      });
  }

  cleanUp() {
    // if match selected and cond selected and not choices, clear out cond
    if (!this.rule.salesSL1CritChoices.length) {
      this.rule.salesSL1CritCond = undefined;
    }
    if (!this.rule.salesSL2CritChoices.length) {
      this.rule.salesSL2CritCond = undefined;
    }
    if (!this.rule.salesSL3CritChoices.length) {
      this.rule.salesSL3CritCond = undefined;
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

  validateSaveToDraft() {
    const errors = [];
    if (!(this.rule.name && this.rule.name.trim())) {
      errors.push('You must define a name to save to draft.');
    }
    if (_.includes(this.ruleNames, this.rule.name)) {
      errors.push('Rule name already exists.');
    }
    return errors.length ? errors : null;
  }

  saveToDraft() {
    const errors = this.validateSaveToDraft();
    if (errors) {
      this.uiUtil.validationErrorsDialog(errors);
    } else {
      this.cleanUp();
      const saveMode = UiUtil.getApprovalSaveMode(this.rule.status, this.addMode, this.editMode, this.copyMode);
      this.ruleService.saveToDraft(this.rule, {saveMode})
        .subscribe(rule => {
          // once saved we need to update, not add, so move mode to edit (uiUtil.getApprovalSaveMode())
          this.addMode = false;
          this.copyMode = false;
          this.editMode = true;
          this.rule = rule;
          this.uiUtil.toast('Rule saved to draft.');
        });
    }
  }

  reject() {
    this.uiUtil.confirmReject('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                this.rule.approveRejectMessage = resultPrompt;
                this.cleanUp();
                this.ruleService.reject(this.rule)
                  .subscribe(rule => {
                    this.uiUtil.toast('Rule has been rejected, user notified.');
                    history.go(-1);
                  });
              }
            });
        }
      });
  }

  approve() {
    this.uiUtil.confirmApprove('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                this.rule.approveRejectMessage = resultPrompt;
                this.cleanUp();
                this.ruleService.approve(this.rule)
                  .subscribe(() => {
                    this.uiUtil.toast('Rule approved, user notified.');
                    history.go(-1);
                  });
              }
            });
        }
      });
  }

  submitForApproval() {
    UiUtil.triggerBlur('.fin-container form');
    UiUtil.waitForAsyncValidations(this.form)
      .then(() => {
        if (this.form.valid) {
          this.uiUtil.confirmSubmitForApproval()
            .subscribe(result => {
              if (result) {
                this.cleanUp();
                const saveMode = UiUtil.getApprovalSaveMode(this.rule.status, this.addMode, this.editMode, this.copyMode);
                this.ruleService.submitForApproval(this.rule, {saveMode})
                  .subscribe(() => {
                    this.uiUtil.toast('Rule submitted for approval.');
                    history.go(-1);
                  });
              }
            });
        }
      });
  }

  salesSL2ChoicesValidator(): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.value || !control.value.length) {
        return Promise.resolve(null);
      }
      return this.ruleService.validateSalesSL2CritChoices(control.value)
        .pipe(map(results => {
          if (!results.exist) {
            return {salesSL2Choices: {value: control.value}};
          } else {
            if (!_.isEqual(this.rule.salesSL2CritChoices, results.values)) {
              this.rule.salesSL2CritChoices = results.values;
            }
            return null;
          }
        }));
    });
  }

  salesSL3ChoicesValidator(): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.value || !control.value.length) {
        return Promise.resolve(null);
      }
      return this.ruleService.validateSalesSL3CritChoices(control.value)
        .pipe(map(results => {
          if (!results.exist) {
            return {salesSL3Choices: {value: control.value}};
          } else {
            if (!_.isEqual(this.rule.salesSL3CritChoices, results.values)) {
              this.rule.salesSL3CritChoices = results.values;
            }
            return null;
          }
        }));
    });
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

}
