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
  addMode = false;
  viewMode = false;
  editMode = false;
  copyMode = false;
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
  periods = [{period: 'MTD'}, {period: 'ROLL6'}, {period: 'ROLL3'}];
  conditionalOperators = [{operator: 'IN'}, {operator: 'NOT IN'}];
  salesMatches = [{match: 'SL1'}, {match: 'SL2'}, {match: 'SL3'}, {match: 'SL4'}, {match: 'SL5'}, {match: 'SL6'}];
  productMatches = [{match: 'BU'}, {match: 'PF'}, {match: 'TG'}]; // no PID
  scmsMatches = [{match: 'SCMS'}];
  legalEntityMatches = [{match: 'Business Entity'}];
  beMatches = [{match: 'BE'}, {match: 'Sub BE'}];
  sl1CondRequired = false;
  pfCondRequired = false;
  buCondRequired = false;
  tgCondRequired = false;
  scmsCondRequired = false;
  beCondRequired = false;

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
    public uiUtil: UiUtil,
    private changeDetectorRef: ChangeDetectorRef
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
      this.pgLookupService.getRuleCriteriaChoicesSalesLevel1().toPromise(),
      this.pgLookupService.getRuleCriteriaChoicesProdTg().toPromise(),
      this.pgLookupService.getRuleCriteriaChoicesScms().toPromise(),
      this.pgLookupService.getRuleCriteriaChoicesInternalBeBe().toPromise(),
      this.ruleService.getDistinctRuleNames().toPromise(),
    ];
    if (this.viewMode || this.editMode || this.copyMode) {
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

        if (this.viewMode || this.editMode || this.copyMode) {
          this.rule = results[5];
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
        this.setConditionalRequireds();

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
          this.router.navigateByUrl('/prof/rule-management');
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
    // clear out condition/choices if no match selected:
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
    this.uiUtil.confirmReject()
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
                    this.router.navigateByUrl('/prof/rule-management');
                  });
              }
            });
        }
      });
  }

  approve() {
    this.uiUtil.confirmApprove()
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
                    this.router.navigateByUrl('/prof/rule-management');
                  });
              }
            });
        }
      });
  }

  submitForApproval() {
    UiUtil.triggerBlur('.fin-edit-container form');
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
                  this.router.navigateByUrl('/prof/rule-management');
                });
              }
            });
        }
      });
  }

  setConditionalRequireds() {
    this.sl1CondRequired = false;
    this.pfCondRequired = false;
    this.buCondRequired = false;
    this.tgCondRequired = false;
    this.scmsCondRequired = false;
    this.beCondRequired = false;

    if (this.rule.salesMatch && this.rule.salesCritChoices.length) {
      this.sl1CondRequired = true;
    }
    if (this.rule.productMatch && this.rule.prodPFCritChoices.length) {
      this.pfCondRequired = true;
    }
    if (this.rule.productMatch && this.rule.prodBUCritChoices.length) {
      this.buCondRequired = true;
    }
    if (this.rule.productMatch && this.rule.prodTGCritChoices.length) {
      this.tgCondRequired = true;
    }
    if (this.rule.scmsMatch && this.rule.scmsCritChoices.length) {
      this.scmsCondRequired = true;
    }
    if (this.rule.beMatch && this.rule.beCritChoices.length) {
      this.beCondRequired = true;
    }
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
    this.setConditionalRequireds();
  }

}
