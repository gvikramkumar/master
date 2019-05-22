import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {RuleService} from '../../services/rule.service';
import {PgLookupService} from '../../services/pg-lookup.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import _ from 'lodash';
import {DialogInputType, DialogType} from '../../../../core/models/ui-enums';
import {UiUtil} from '../../../../core/services/ui-util';
import {AbstractControl, AsyncValidatorFn, NgForm, ValidationErrors} from '@angular/forms';
import {ValidationInputOptions} from '../../../../shared/components/validation-input/validation-input.component';
import {map} from 'rxjs/operators';
import {LookupService} from '../../services/lookup.service';
import AnyObj from '../../../../../../../shared/models/any-obj';
import {SelectExceptionMap} from '../../../../../../../shared/classes/select-exception-map';
import {shUtil} from '../../../../../../../shared/misc/shared-util';
import {ruleUtil} from '../../../../../../../shared/misc/rule-util';
import {MatDialog} from '@angular/material';
import {SubmeasureService} from '../../services/submeasure.service';
import {Submeasure} from '../../../../../../../shared/models/submeasure';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-edit.component.html',
  styleUrls: ['./rule-management-edit.component.scss']
})
export class RuleManagementEditComponent extends RoutingComponentBase implements OnInit {
  rules: AllocationRule[];
  selectMap: SelectExceptionMap;
  ruleNames: string[] = [];
  salesSL2ChoiceOptions: ValidationInputOptions;
  salesSL3ChoiceOptions: ValidationInputOptions;
  prodPFChoiceOptions: ValidationInputOptions;
  prodBUChoiceOptions: ValidationInputOptions;
  @ViewChild('form') form: NgForm;
  UiUtil = UiUtil;
  addMode = false;
  viewMode = false;
  viewModeDPNotApprovedOnce = false;
  editMode = false;
  editModeAI = false;
  editModeDPApprovedOnce = false;
  editModeDPNotApprovedOnce = false;
  copyMode = false;
  rule = new AllocationRule();
  orgRule: AllocationRule;
  drivers: {name: string, value: string}[];
  periods: {period: string}[];
  submeasures: Submeasure[] = [];
  submeasuresAll: Submeasure[] = [];
  usingSubmeasuresNamesTooltip = '';

  conditionalOperators = [{operator: 'IN'}, {operator: 'NOT IN'}];
  salesMatches = [{match: 'SL1'}, {match: 'SL2'}, {match: 'SL3'}, {match: 'SL4'}, {match: 'SL5'}, {match: 'SL6'}];
  productMatches = [{match: 'BU'}, {match: 'PF'}, {match: 'TG'}]; // no PID
  scmsMatches = [{match: 'SCMS'}];
  legalEntityMatches = [{match: 'Business Entity', abbrev: 'LE'}];
  beMatches = [{match: 'BE'}, {match: 'Sub BE', abbrev: 'SubBE'}];
  countryMatches = [{name: 'Sales Country Name', value: 'sales_country_name', abbrev: 'CNT'}];
  extTheaterMatches = [{name: 'External Theater Name', value: 'ext_theater_name', abbrev: 'EXT'}];
  glSegmentMatches = [{name: 'Account', value: 'ACCOUNT', abbrev: 'ACCT'}, {name: 'Sub Account', value: 'SUB ACCOUNT', abbrev: 'SUBACCT'},
    {name: 'Company', value: 'COMPANY', abbrev: 'COMP'}];
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
    private submeasureService: SubmeasureService,
    private store: AppStore,
    public uiUtil: UiUtil,
    private lookupService: LookupService,
    public dialog: MatDialog
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
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l1_sales_territory_name_code').toPromise(),
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_products', 'technology_group_id').toPromise(),
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_coverage_code').toPromise(),
      this.pgLookupService.getSortedListFromColumn('fpacon.vw_fpa_be_hierarchy', 'business_entity_descr').toPromise(),
      this.lookupService.getValues(['drivers', 'periods']).toPromise()
    ];
    if (this.viewMode || this.editMode || this.copyMode) {
      promises.push(
        this.ruleService.getOneById(this.route.snapshot.params.id).toPromise(),
        this.submeasureService.getManyLatestGroupByNameActive().toPromise()
      );
    }
    Promise.all(promises)
      .then(results => {
        // assign to your local arrays here, then:
        // map result string arrays to object arrays for use in dropdowns
        this.salesSL1Choices = results[0].map(x => ({name: x}));
        this.prodTgChoices = results[1].map(x => ({name: x}));
        this.scmsChoices = results[2].map(x => ({name: x}));
        this.internalBeChoices = results[3].map(x => ({name: x}));
        this.drivers = _.sortBy(results[4][0], 'name');
        this.periods = results[4][1];

        if (this.viewMode || this.editMode || this.copyMode) {
          this.rule = results[5];
          this.submeasuresAll = results[6];
          this.editModeAI = this.editMode && _.includes(['A', 'I'], this.rule.status);
          this.editModeDPApprovedOnce = this.editMode && _.includes(['D', 'P'], this.rule.status) && this.rule.approvedOnce === 'Y';
          this.editModeDPNotApprovedOnce = this.editMode && _.includes(['D', 'P'], this.rule.status) && this.rule.approvedOnce !== 'Y';
          this.viewModeDPNotApprovedOnce = this.viewMode && _.includes(['D', 'P'], this.rule.status) && this.rule.approvedOnce !== 'Y';
          this.checkIfInUse();
        }
        if (this.copyMode) {
          this.rule.approvedOnce = 'N';
          this.rule.status = 'D';
          delete this.rule.createdBy;
          delete this.rule.createdDate;
        }
        if (this.editMode) {
          if (this.editModeAI) {
            delete this.rule.createdBy;
            delete this.rule.createdDate;
          }
          if (this.editModeAI || this.editModeDPApprovedOnce) {
            // they can't edit approvedOnce rules other than to set active/inactive. The ruleNames are all status = active/inactive,
            // not draft/pending which is what they'll be editing with, so complain if rulename already exists in A/I bunch. We have a catchall in
            // approvalController.approve() that won't approve if name already exists, but we want them to see that here as well
            this.ruleNames = _.without(this.ruleNames, this.rule.name); // if setting active/inactive, then allow name existence
          }
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

        this.prodBUChoiceOptions = {
          asyncValidations: [
            {
              name: 'prodBUChoices',
              message: 'Some product BU select fields don\'t exist',
              fcn: this.prodBUChoicesValidator()
            }
          ]
        };

        this.init(true);
      })
      .then(() => {
        return this.getRulesAndRuleNamesAndGenerateSelectMap(); // must be "after" this.rule is set
      });
  }

  init(initial?) {
    ruleUtil.createSelectArrays(this.rule);
    if (initial) {
      // we need these statements to be exactly how the ui would generate so they can be compared for changes
      // so update them right after creating the select arrays, "then" save to orgRule
      this.updateSelectStatements();
      this.orgRule = _.cloneDeep(this.rule);
      // for draft/pending we need to let them know name already exists, but not for approvedOnce = 'Y', as the name is already locked by then
      if (this.editModeDPNotApprovedOnce || this.viewModeDPNotApprovedOnce) {
        this.checkIfRuleNameAlreadyExists();
      }
    }
  }

  getRulesAndRuleNamesAndGenerateSelectMap() {
    return this.ruleService.getManyLatestGroupByNameActiveInactiveConcatDraftPending().toPromise()
      .then(rules => {
        // remove this rule if it's in the list, it can muck up the selectMap if it has different values from the present
        this.rules = rules.filter(r => this.rule.id ? r.id !== this.rule.id : true);
        // we allow duplicate names in draft/pending, will complain on approval
        this.ruleNames = this.rules.filter(r => _.includes(['A', 'I'], r.status)).map(x => x.name);
        this.rules.forEach(rule => ruleUtil.createSelectArrays(rule));
      })
      .then(() => {
        const selectMap = new SelectExceptionMap();
        // we check for validity of selectMap on entry/save and on approve in controller. We can't have this selectMap ever be corrupt,
        // so both places will put up modals, should never happen, but if it does... we have to know
        try {
          selectMap.parseRules(this.rules);
          // we need to wait till here to set this as valueChange() is getting called on page load and can't get this  (parseRules is done)
          // it returns if !this.selectMap
          this.selectMap = selectMap;
        } catch (err) {
          this.uiUtil.genericDialog(err.message);
          return Promise.reject();
        }
      });
  }

  checkIfInUse() {
    this.submeasures = this.submeasuresAll.filter(sm => _.includes(sm.rules, this.rule.name));
    this.usingSubmeasuresNamesTooltip = 'Rule is in use by the following submeasures: ';
    this.usingSubmeasuresNamesTooltip += this.submeasures.map(sm => sm.name).join(', ');
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
    // we use the select statements for comparison, so update before compare
    this.updateSelectStatements();
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          this.rule = _.cloneDeep(this.orgRule);
          this.init();
        }
      });
  }

  cleanUp() {
    this.updateSelectStatements();
  }

  validate() {
    const errors = [];

/*
    if (something wrong) {
      errors.push('some message');
    }
*/
  return errors.length ? errors : null;
  }

  validateNameAndSelectmap() {
    // we need to check if any conflicting rules. yes we just did that multiple times maybe on blur call, but we need to do it
    // a final time "with the lastest aidp values". I.e. on blur we used the values on page load, we can never have them create duplicate
    // rule select exceptions, so we check right before save (grrr, this isn't right before save), still have that dialog to put up and down
    // for submit... so we'll have to validate after as well then
    return this.getRulesAndRuleNamesAndGenerateSelectMap()
      .then (() => {
        const oldName = this.rule.name;
        // generate a new name considering the latest approved rules
        const ruleNameExists = this.valueChange();
        if (ruleNameExists) {
          return Promise.reject('disregard');
        } else if (this.rule.name !== oldName) {
          // they need to be notified so they can update the associated submeasures
          this.uiUtil.genericDialog('A select exception conflict caused a name change. Please review.');
          return Promise.reject('disregard');
        }

      });
  }

  saveToDraft() {
    UiUtil.triggerBlur('.fin-container form');
    UiUtil.waitForAsyncValidations(this.form)
      .then(() => {
        if (this.form.valid) {
          this.cleanUp();
          const errors = this.validate();
          if (errors) {
            this.uiUtil.validationErrorsDialog(errors);
            return Promise.reject('disregard');
          }
          this.validateNameAndSelectmap()
            .then(() => {
              const saveMode = UiUtil.getApprovalSaveMode(this.rule.status, this.addMode, this.editMode, this.copyMode);
              this.ruleService.saveToDraft(this.rule, {saveMode})
                .subscribe(rule => {
                  // once saved we need to update, not add, so move mode to edit (uiUtil.getApprovalSaveMode())
                  this.addMode = false;
                  this.copyMode = false;
                  this.editMode = true;
                  this.rule = rule;
                  this.orgRule = _.cloneDeep(rule);
                  this.init();
                  this.uiUtil.toast('Rule saved to draft.');
                });
            })
            // this to supress the angular error upon seeing a reject. Funny thing is: the one in the outer "then" won't do,
            // have to catch it in here to catch the validateNameAndSelectmap rejects
            .catch(shUtil.catchDisregardHandler);
        }
      })
      .catch(shUtil.catchDisregardHandler);
  }

  canApprove() {
    return this.uiUtil.canAdminApprove(this.rule.updatedBy);
  }

  reject() {
    this.uiUtil.confirmReject('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                this.rule.approveRejectMessage = resultPrompt;
                this.ruleService.reject(this.rule)
                  .subscribe(rule => {
                    history.go(-1);
                  });
              }
            });
        }
      });
  }

  approve() {
    if (this.viewModeDPNotApprovedOnce && this.checkIfRuleNameAlreadyExists()) {
      return;
    }
    this.uiUtil.confirmApprove('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                this.rule.approveRejectMessage = resultPrompt;
                this.ruleService.approve(this.rule)
                  .subscribe(() => {
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
          this.cleanUp();
          const errors = this.validate();
          if (errors) {
            this.uiUtil.validationErrorsDialog(errors);
          } else {
            this.uiUtil.confirmSubmitForApproval().toPromise()
              .then(result => {
                if (result) {
                  // we cannot under any circumstance allow these select exceptions to be compromised.
                  // we cannot afford to do it "before" the confirmation dialog, we have to do it right before save, so has its own validation function
                  // that gets called after confirmation goes down
                  this.validateNameAndSelectmap()
                    .then(() => {
                      const saveMode = UiUtil.getApprovalSaveMode(this.rule.status, this.addMode, this.editMode, this.copyMode);
                      this.ruleService.submitForApproval(this.rule, {saveMode, type: 'rule-management'})
                        .subscribe(() => {
                          history.go(-1);
                        });
                    })
                    // this to supress the angular error upon seeing a reject. Funny thing is: the one in the outer "then" won't do,
                    // have to catch it in here to catch the validateNameAndSelectmap rejects
                    .catch(shUtil.catchDisregardHandler);
                }
              });
          }
        }
      })
      .catch(shUtil.catchDisregardHandler);
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

  updateSelectStatements() {
    if (this.rule.salesSL1CritCond && this.rule.salesSL1CritChoices.length) {
      this.rule.sl1Select = ruleUtil.createSelect(this.rule.salesSL1CritCond, this.rule.salesSL1CritChoices);
    } else {
      this.rule.sl1Select = undefined;
    }

    if (this.rule.salesSL2CritCond && this.rule.salesSL2CritChoices.length) {
      this.rule.sl2Select = ruleUtil.createSelect(this.rule.salesSL2CritCond, this.rule.salesSL2CritChoices);
    } else {
      this.rule.sl2Select = undefined;
    }

    if (this.rule.salesSL3CritCond && this.rule.salesSL3CritChoices.length) {
      this.rule.sl3Select = ruleUtil.createSelect(this.rule.salesSL3CritCond, this.rule.salesSL3CritChoices);
    } else {
      this.rule.sl3Select = undefined;
    }

    if (this.rule.prodPFCritCond && this.rule.prodPFCritChoices.length) {
      this.rule.prodPFSelect = ruleUtil.createSelect(this.rule.prodPFCritCond, this.rule.prodPFCritChoices);
    } else {
      this.rule.prodPFSelect = undefined;
    }
    if (this.rule.prodBUCritCond && this.rule.prodBUCritChoices.length) {
      // validate BU choices and gen sql
      this.rule.prodBUSelect = ruleUtil.createSelect(this.rule.prodBUCritCond, this.rule.prodBUCritChoices);
    } else {
      this.rule.prodBUSelect = undefined;
    }
    if (this.rule.prodTGCritCond && this.rule.prodTGCritChoices.length) {
      this.rule.prodTGSelect = ruleUtil.createSelect(this.rule.prodTGCritCond, this.rule.prodTGCritChoices);
    } else {
      this.rule.prodTGSelect = undefined;
    }

    if (this.rule.scmsCritCond && this.rule.scmsCritChoices.length) {
      this.rule.scmsSelect = ruleUtil.createSelect(this.rule.scmsCritCond, this.rule.scmsCritChoices);
    } else {
      this.rule.scmsSelect = undefined;
    }

    if (this.rule.beCritCond && this.rule.beCritChoices.length) {
      this.rule.beSelect = ruleUtil.createSelect(this.rule.beCritCond, this.rule.beCritChoices);
    } else {
      this.rule.beSelect = undefined;
    }

  }

  isApprovedOnce() {
    return this.rule.approvedOnce === 'Y';
  }

  valueChange() {
    // shouldn't get called for viewMode and if approvedOnce, they can only edit active flag, so just return
    if (!this.selectMap || this.viewMode || this.isApprovedOnce()) {
      return Promise.resolve(false);
    }

    // we need to clone the selectMap, otherwise they add to it then remove their entry, but addition is still there
    // so we'll clone it every time we generate a new name
    const smap = _.cloneDeep(this.selectMap);
    this.updateSelectStatements();
    ruleUtil.addRuleNameAndDescription(this.rule, smap, this.drivers, this.periods);
    // console.log(smap.buMap);
    return this.checkIfRuleNameAlreadyExists();
  }

  checkIfRuleNameAlreadyExists() {
    if (_.includes(this.ruleNames, this.rule.name)) {
      // we call blur on all selects which all call this all at once and crashes with all the modal calls, so look for it and if there, don't put it up
      if (!this.dialog.openDialogs.length) {
        this.uiUtil.genericDialog(`A rule by this name already exists: ${this.rule.name}`);
      }
      return true;
    } else {
      return false;
    }
  }

}
