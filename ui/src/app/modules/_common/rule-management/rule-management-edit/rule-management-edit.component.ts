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
import {AbstractControl, AsyncValidatorFn, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
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
  drivers: { name: string, value: string }[];
  periods: { period: string }[];
  submeasuresInUse: Submeasure[] = [];
  submeasuresAll: Submeasure[] = [];
  usingSubmeasuresNamesTooltip = '';

  conditionalOperators = [{operator: 'IN'}, {operator: 'NOT IN'}];
  salesMatches = [{name: 'Level 1', value: 'SL1'}, {name: 'Level 2', value: 'SL2'}, {name: 'Level 3', value: 'SL3'},
    {name: 'Level 4', value: 'SL4'}, {name: 'Level 5', value: 'SL5'}, {name: 'Level 6', value: 'SL6'}];
  productMatches = [{name: 'Business Unit', value: 'BU'}, {name: 'Product Family', value: 'PF'}, {
    name: 'Technology Group',
    value: 'TG'
  }, {name: 'Product ID', value: 'PID'}];
  scmsMatches = [{match: 'SCMS'}];
  legalEntityMatches = [{match: 'Business Entity', abbrev: 'LE'}];
  beMatches = [{name: 'Internal BE', value: 'BE', abbrev: 'IBE'}, {
    name: 'Internal Sub BE',
    value: 'Sub BE',
    abbrev: 'ISBE'
  }];
  countryMatches = [{name: 'Sales Country Name', value: 'sales_country_name', abbrev: 'CNT'}];
  extTheaterMatches = [{name: 'External Theater Name', value: 'ext_theater_name', abbrev: 'EXT'}];
  glSegmentMatches = [{name: 'Account', value: 'ACCOUNT', abbrev: 'ACCT'}, {
    name: 'Sub Account',
    value: 'SUB ACCOUNT',
    abbrev: 'SUBACCT'
  },
    {name: 'Company', value: 'COMPANY', abbrev: 'COMP'}];
  // SELECT options to be taken from Postgres
  sl1Sl2Sl3NameCodes: { sl1: string, sl2: string, sl3: string }[] = [];
  tgBuPfProductIds: { tg: string, bu: string, pf: string }[] = [];
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
    public dialog: MatDialog,
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
      this.pgLookupService.callRepoMethod('getDistinctSL1SL2SL3NameCodeFromSalesHierarchy').toPromise(),
      this.pgLookupService.callRepoMethod('getDistincTGBUPFIdsFromProductHierarchy').toPromise(),
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
        this.sl1Sl2Sl3NameCodes = results[0];
        this.salesSL1Choices = _.uniq(this.sl1Sl2Sl3NameCodes.map(x => x.sl1)).map(x => ({name: x}));
        this.tgBuPfProductIds = results[1];
        this.prodTgChoices = _.uniq(this.tgBuPfProductIds.map(x => x.tg)).map(x => ({name: x}));
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
          validations: [
            {
              name: 'salesSL2Choices',
              message: 'Invalid SL2 values: %s',
              fcn: this.salesSL2ChoicesValidator()
            }
          ]
        };

        this.salesSL3ChoiceOptions = {
          validations: [
            {
              name: 'salesSL3Choices',
              message: 'Invalid SL3 values: %s',
              fcn: this.salesSL3ChoicesValidator()
            }
          ]
        };

        this.prodBUChoiceOptions = {
          validations: [
            {
              name: 'prodBUChoices',
              message: 'Invalid BU values: %s',
              fcn: this.prodBUChoicesValidator()
            }
          ]
        };

        this.prodPFChoiceOptions = {
          validations: [
            {
              name: 'prodPFChoices',
              message: 'Invalid PF values: %s',
              fcn: this.prodPFChoicesValidator()
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
    this.submeasuresInUse = this.submeasuresAll.filter(sm => _.includes(sm.rules, this.rule.name));
    this.usingSubmeasuresNamesTooltip = 'Rule is in use by the following submeasures: ';
    this.usingSubmeasuresNamesTooltip += this.submeasuresInUse.map(sm => sm.name).join(', ');
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
      .then(() => {
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
              history.go(-1);
            });
        })
        // this to supress the angular error upon seeing a reject. Funny thing is: the one in the outer "then" won't do,
        // have to catch it in here to catch the validateNameAndSelectmap rejects
        .catch(shUtil.catchDisregardHandler);
    }
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
  }

  getSl1Sl2Sl3NameCodesFilteredForSl1() {
    const sl1Selections = this.rule.salesSL1CritChoices.map(x => x.toUpperCase());
    if (this.rule.salesSL1CritChoices.length && this.rule.salesSL1CritCond === 'IN') {
      return this.sl1Sl2Sl3NameCodes.filter(x => _.includes(sl1Selections, x.sl1.toUpperCase()));
    } else if (this.rule.salesSL1CritChoices.length && this.rule.salesSL1CritCond === 'NOT IN') {
      return this.sl1Sl2Sl3NameCodes.filter(x => !_.includes(sl1Selections, x.sl1.toUpperCase()));
    } else {
      return this.sl1Sl2Sl3NameCodes;
    }
  }

  getSl1Sl2Sl3NameCodesFilteredForSl2() {
    const sl2Selections = this.rule.salesSL2CritChoices.map(x => x.toUpperCase());
    if (this.rule.salesSL2CritChoices.length && this.rule.salesSL2CritCond === 'IN') {
      return this.sl1Sl2Sl3NameCodes.filter(x => _.includes(sl2Selections, x.sl2.toUpperCase()));
    } else if (this.rule.salesSL2CritChoices.length && this.rule.salesSL2CritCond === 'NOT IN') {
      let available;
      available = this.getSl1Sl2Sl3NameCodesFilteredForSl1();
      available = available.filter(x => !_.includes(sl2Selections, x.sl2.toUpperCase()));
      return available;
    } else {
      return this.sl1Sl2Sl3NameCodes;
    }
  }

  salesSL2ChoicesValidator(): ValidatorFn {
    const fcn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.value.length) {
        return null;
      }
      const selections = shUtil.arrayFilterUndefinedAndEmptyStrings(control.value);
      const available = this.getSl1Sl2Sl3NameCodesFilteredForSl1();
      const actuals = [];
      const notFound = [];
      selections.forEach(sel => {
        const found = _.find(available, x => sel.toUpperCase() === x.sl2.toUpperCase());
        if (found) {
          actuals.push(found.sl2);
        } else {
          notFound.push(sel);
        }
      });
      if (notFound.length) {
        return {salesSL2Choices: {value: notFound.join(', ')}};
      } else {
        // no need updating unless case has changed, if you pull this out, angualar will freeze with the circulare detectChanges?
        // bug: was all caps, then you changed to first letter lowercase, but acutals all caps again so no change so doesn't update value,
        // it's for that reason you had to add the part after the OR looking at selections as well
        if (!_.isEqual(this.rule.salesSL2CritChoices, actuals) || !_.isEqual(this.rule.salesSL2CritChoices, selections)) {
          this.rule.salesSL2CritChoices = actuals;
          this.changeDetectorRef.detectChanges();
        }
        return null;
      }
    };
    // if in control and hit save button (which calls triggerBlur(), we'll get double hits on this, shut that down
    return _.throttle(fcn.bind(this), 400, {trailing: false});
  }

  salesSL3ChoicesValidator(): ValidatorFn {
    const fcn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.value.length) {
        return null;
      }

      const selections = shUtil.arrayFilterUndefinedAndEmptyStrings(control.value);
      let actuals = [], notFound = [];
      let available;
      if ((this.rule.salesSL2CritChoices.length && this.rule.salesSL2CritCond) && (this.rule.salesSL1CritChoices.length && this.rule.salesSL1CritCond)) {
        available = this.getSl1Sl2Sl3NameCodesFilteredForSl1();
        let results = findSl3InAvailable(selections, available);
        actuals = results.actuals;
        notFound = results.notFound;
        if (!notFound.length) {
          available = this.getSl1Sl2Sl3NameCodesFilteredForSl2();
          results = findSl3InAvailable(selections, available);
          actuals = results.actuals;
          notFound = results.notFound;
        }
      } else {
        if (this.rule.salesSL1CritChoices.length && this.rule.salesSL1CritCond) {
          available = this.getSl1Sl2Sl3NameCodesFilteredForSl1();
        } else if (this.rule.salesSL2CritChoices.length && this.rule.salesSL2CritCond) {
          available = this.getSl1Sl2Sl3NameCodesFilteredForSl2();
        } else {
          available = this.sl1Sl2Sl3NameCodes;
        }
        const results = findSl3InAvailable(selections, available);
        actuals = results.actuals;
        notFound = results.notFound;
      }
      if (notFound.length) {
        return {salesSL3Choices: {value: notFound.join(', ')}};
      } else {
        // no need updating unless case has changed, if you pull this out, angualar will freeze with the circulare detectChanges?
        // bug: was all caps, then you changed to first letter lowercase, but acutals all caps again so no change so doesn't update value,
        // it's for that reason you had to add the part after the OR looking at selections as well
        if (!_.isEqual(this.rule.salesSL3CritChoices, actuals) || !_.isEqual(this.rule.salesSL3CritChoices, selections)) {
          this.rule.salesSL3CritChoices = actuals;
          this.changeDetectorRef.detectChanges();
        }
        return null;
      }
    };
    // if in control and hit save button (which calls triggerBlur(), we'll get double hits on this, shut that down
    return _.throttle(fcn.bind(this), 400, {trailing: false});

    function findSl3InAvailable(selections, available) {
      const actuals = [];
      const notFound = [];
      selections.forEach(sel => {
        const found = _.find(available, x => sel.toUpperCase() === x.sl3.toUpperCase());
        if (found) {
          actuals.push(found.sl3);
        } else {
          notFound.push(sel);
        }
      });
      return ({actuals, notFound});
    }
  }

  getTgBuPfProductIdsFilteredForTg() {
    const tgSelections = this.rule.prodTGCritChoices.map(x => x.toUpperCase());
    if (this.rule.prodTGCritChoices.length && this.rule.prodTGCritCond === 'IN') {
      return this.tgBuPfProductIds.filter(x => _.includes(tgSelections, x.tg.toUpperCase()));
    } else if (this.rule.prodTGCritChoices.length && this.rule.prodTGCritCond === 'NOT IN') {
      return this.tgBuPfProductIds.filter(x => !_.includes(tgSelections, x.tg.toUpperCase()));
    } else {
      return this.tgBuPfProductIds;
    }
  }

  getTgBuPfProductIdsFilteredForBu() {
    const buSelections = this.rule.prodBUCritChoices.map(x => x.toUpperCase());
    if (this.rule.prodBUCritChoices.length && this.rule.prodBUCritCond === 'IN') {
      return this.tgBuPfProductIds.filter(x => _.includes(buSelections, x.bu.toUpperCase()));
    } else if (this.rule.prodBUCritChoices.length && this.rule.prodBUCritCond === 'NOT IN') {
      let available;
      available = this.getTgBuPfProductIdsFilteredForTg();
      available = available.filter(x => !_.includes(buSelections, x.bu.toUpperCase()));
      return available;
    } else {
      return this.tgBuPfProductIds;
    }
  }

  prodBUChoicesValidator(): ValidatorFn {
    const fcn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.value.length) {
        return null;
      }
      const selections = shUtil.arrayFilterUndefinedAndEmptyStrings(control.value);
      const available = this.getTgBuPfProductIdsFilteredForTg();
      const actuals = [];
      const notFound = [];
      selections.forEach(sel => {
        const found = _.find(available, x => sel.toUpperCase() === x.bu.toUpperCase());
        if (found) {
          actuals.push(found.bu);
        } else {
          notFound.push(sel);
        }
      });
      if (notFound.length) {
        return {prodBUChoices: {value: notFound.join(', ')}};
      } else {
        // no need updating unless case has changed, if you pull this out, angualar will freeze with the circulare detectChanges?
        // bug: was all caps, then you changed to first letter lowercase, but acutals all caps again so no change so doesn't update value,
        // it's for that reason you had to add the part after the OR looking at selections as well
        if (!_.isEqual(this.rule.prodBUCritChoices, actuals) || !_.isEqual(this.rule.prodBUCritChoices, selections)) {
          this.rule.prodBUCritChoices = actuals;
          this.changeDetectorRef.detectChanges();
        }
        return null;
      }
    };
    // if in control and hit save button (which calls triggerBlur(), we'll get double hits on this, shut that down
    return _.throttle(fcn.bind(this), 400, {trailing: false});
  }

  prodPFChoicesValidator(): ValidatorFn {
    const fcn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.value.length) {
        return null;
      }

      const selections = shUtil.arrayFilterUndefinedAndEmptyStrings(control.value);
      let actuals = [], notFound = [];
      let available;
      if ((this.rule.prodBUCritChoices.length && this.rule.prodBUCritCond) && (this.rule.prodTGCritChoices.length && this.rule.prodTGCritCond)) {
        available = this.getTgBuPfProductIdsFilteredForTg();
        let results = findPfInAvailable(selections, available);
        actuals = results.actuals;
        notFound = results.notFound;
        if (!notFound.length) {
          available = this.getTgBuPfProductIdsFilteredForBu();
          results = findPfInAvailable(selections, available);
          actuals = results.actuals;
          notFound = results.notFound;
        }
      } else {
        if (this.rule.prodTGCritChoices.length && this.rule.prodTGCritCond) {
          available = this.getTgBuPfProductIdsFilteredForTg();
        } else if (this.rule.prodBUCritChoices.length && this.rule.prodBUCritCond) {
          available = this.getTgBuPfProductIdsFilteredForBu();
        } else {
          available = this.tgBuPfProductIds;
        }
        const results = findPfInAvailable(selections, available);
        actuals = results.actuals;
        notFound = results.notFound;
      }
      if (notFound.length) {
        return {prodPFChoices: {value: notFound.join(', ')}};
      } else {
        // no need updating unless case has changed, if you pull this out, angualar will freeze with the circulare detectChanges?
        // bug: was all caps, then you changed to first letter lowercase, but acutals all caps again so no change so doesn't update value,
        // it's for that reason you had to add the part after the OR looking at selections as well
        if (!_.isEqual(this.rule.prodPFCritChoices, actuals) || !_.isEqual(this.rule.prodPFCritChoices, selections)) {
          this.rule.prodPFCritChoices = actuals;
          this.changeDetectorRef.detectChanges();
        }
        return null;
      }
    };
    // if in control and hit save button (which calls triggerBlur(), we'll get double hits on this, shut that down
    return _.throttle(fcn.bind(this), 400, {trailing: false});

    function findPfInAvailable(selections, available) {
      const actuals = [];
      const notFound = [];
      selections.forEach(sel => {
        const found = _.find(available, x => sel.toUpperCase() === x.pf.toUpperCase());
        if (found) {
          actuals.push(found.pf);
        } else {
          notFound.push(sel);
        }
      });
      return ({actuals, notFound});
    }
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
      return false;
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

  isInUse() {
    return this.isApprovedOnce() && !!this.submeasuresInUse.length;
  }

  disableSave() {
    return this.isInUse() && (this.rule && this.rule.activeStatus === 'A');
  }

}
