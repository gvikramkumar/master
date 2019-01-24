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
  salesSL1CritCond: string;
  salesSL2CritCond: string;
  salesSL3CritCond: string;
  prodPFCritCond: string;
  prodBUCritCond: string;
  prodTGCritCond: string;
  scmsCritCond: string;
  beCritCond: string;
  salesSL1CritChoices: string[] = [];
  salesSL2CritChoices: string[] = [];
  salesSL3CritChoices: string[] = [];
  prodPFCritChoices: string[] = [];
  prodBUCritChoices: string[] = [];
  prodTGCritChoices: string[] = [];
  scmsCritChoices: string[] = [];
  beCritChoices: string[] = [];
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
  orgRule: AllocationRule;
  drivers: {name: string, value: string}[];
  periods: {period: string}[];

  conditionalOperators = [{operator: 'IN'}, {operator: 'NOT IN'}];
  salesMatches = [{match: 'SL1'}, {match: 'SL2'}, {match: 'SL3'}, {match: 'SL4'}, {match: 'SL5'}, {match: 'SL6'}];
  productMatches = [{match: 'BU'}, {match: 'PF'}, {match: 'TG'}]; // no PID
  scmsMatches = [{match: 'SCMS'}];
  legalEntityMatches = [{match: 'Business Entity'}];
  beMatches = [{match: 'BE'}, {match: 'Sub BE'}];
  countryMatches = [{name: 'Sales Country Name', value: 'sales_country_name'}];
  extTheaterMatches = [{name: 'External Theater Name', value: 'ext_theater_name'}];
  glSegmentMatches = [{name: 'Account'}, {name: 'Sub Account'}, {name: 'Company'}];
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
      this.ruleService.getDistinct('name', {moduleId: -1}).toPromise(),
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
        }
        if (this.editMode) {
          if (_.includes(['A', 'I'], this.rule.status)) {
            delete this.rule.createdBy;
            delete this.rule.createdDate;
          }
          this.ruleNames = _.without(this.ruleNames, this.rule.name.toUpperCase());
        }
        this.orgRule = _.cloneDeep(this.rule);

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
    this.createSelectArrays();
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
    if (!this.salesSL1CritChoices.length) {
      this.salesSL1CritCond = undefined;
    }
    if (!this.salesSL2CritChoices.length) {
      this.salesSL2CritCond = undefined;
    }
    if (!this.salesSL3CritChoices.length) {
      this.salesSL3CritCond = undefined;
    }
    if (!this.prodPFCritChoices.length) {
      this.prodPFCritCond = undefined;
    }
    if (!this.prodBUCritChoices.length) {
      this.prodBUCritCond = undefined;
    }
    if (!this.prodTGCritChoices.length) {
      this.prodTGCritCond = undefined;
    }
    if (!this.scmsCritChoices.length) {
      this.scmsCritCond = undefined;
    }
    if (!this.beCritChoices.length) {
      this.beCritCond = undefined;
    }

    this.updateSelectStatements();
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
              if (resultPrompt !== 'DIALOG_CANCEL') {
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
              if (resultPrompt !== 'DIALOG_CANCEL') {
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
            if (!_.isEqual(this.salesSL2CritChoices, results.values)) {
              this.salesSL2CritChoices = results.values;
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
            if (!_.isEqual(this.salesSL3CritChoices, results.values)) {
              this.salesSL3CritChoices = results.values;
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
            if (!_.isEqual(this.prodPFCritChoices, results.values)) {
              this.prodPFCritChoices = results.values;
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
            if (!_.isEqual(this.prodBUCritChoices, results.values)) {
              this.prodBUCritChoices = results.values;
            }
            return null;
          }
        }));
    });
  }

  updateSelectStatements() {
    if (this.salesSL1CritCond && this.salesSL1CritChoices.length) {
      this.rule.sl1Select = this.createSelect(this.salesSL1CritCond, this.salesSL1CritChoices);
    } else {
      this.rule.sl1Select = undefined;
    }

    if (this.salesSL2CritCond && this.salesSL2CritChoices.length) {
      this.rule.sl2Select = this.createSelect(this.salesSL2CritCond, this.salesSL2CritChoices);
    } else {
      this.rule.sl2Select = undefined;
    }

    if (this.salesSL3CritCond && this.salesSL3CritChoices.length) {
      this.rule.sl3Select = this.createSelect(this.salesSL3CritCond, this.salesSL3CritChoices);
    } else {
      this.rule.sl3Select = undefined;
    }

    if (this.prodPFCritCond && this.prodPFCritChoices.length) {
      this.rule.prodPFSelect = this.createSelect(this.prodPFCritCond, this.prodPFCritChoices);
    } else {
      this.rule.prodPFSelect = undefined;
    }
    if (this.prodBUCritCond && this.prodBUCritChoices.length) {
      // validate BU choices and gen sql
      this.rule.prodBUSelect = this.createSelect(this.prodBUCritCond, this.prodBUCritChoices);
    } else {
      this.rule.prodBUSelect = undefined;
    }
    if (this.prodTGCritCond && this.prodTGCritChoices.length) {
      this.rule.prodTGSelect = this.createSelect(this.prodTGCritCond, this.prodTGCritChoices);
    } else {
      this.rule.prodTGSelect = undefined;
    }

    if (this.scmsCritCond && this.scmsCritChoices.length) {
      this.rule.scmsSelect = this.createSelect(this.scmsCritCond, this.scmsCritChoices);
    } else {
      this.rule.scmsSelect = undefined;
    }

    if (this.beCritCond && this.beCritChoices.length) {
      this.rule.beSelect = this.createSelect(this.beCritCond, this.beCritChoices);
    } else {
      this.rule.beSelect = undefined;
    }

  }

  createSelect(cond, choices) {
    let sql = ` ${cond} ( `;
    choices.forEach((choice, idx) => {
      sql += `'${choice.trim()}'`;
      if (idx < choices.length - 1) {
        sql += ', ';
      }
    });
    sql += ` ) `;
    return sql;
  }

  createSelectArrays() {
    if (this.rule.sl1Select && this.rule.sl1Select.trim().length) {
      const parse = this.parseSelect(this.rule.sl1Select);
      this.salesSL1CritCond = parse.cond;
      this.salesSL1CritChoices = parse.arr;
    }

    if (this.rule.sl2Select && this.rule.sl2Select.trim().length) {
      const parse = this.parseSelect(this.rule.sl2Select);
      this.salesSL2CritCond = parse.cond;
      this.salesSL2CritChoices = parse.arr;
    }

    if (this.rule.sl3Select && this.rule.sl3Select.trim().length) {
      const parse = this.parseSelect(this.rule.sl3Select);
      this.salesSL3CritCond = parse.cond;
      this.salesSL3CritChoices = parse.arr;
    }

    if (this.rule.prodPFSelect && this.rule.prodPFSelect.trim().length) {
      const parse = this.parseSelect(this.rule.prodPFSelect);
      this.prodPFCritCond = parse.cond;
      this.prodPFCritChoices = parse.arr;
    }

    if (this.rule.prodBUSelect && this.rule.prodBUSelect.trim().length) {
      const parse = this.parseSelect(this.rule.prodBUSelect);
      this.prodBUCritCond = parse.cond;
      this.prodBUCritChoices = parse.arr;
    }

    if (this.rule.prodTGSelect && this.rule.prodTGSelect.trim().length) {
      const parse = this.parseSelect(this.rule.prodTGSelect);
      this.prodTGCritCond = parse.cond;
      this.prodTGCritChoices = parse.arr;
    }

    if (this.rule.scmsSelect && this.rule.scmsSelect.trim().length) {
      const parse = this.parseSelect(this.rule.scmsSelect);
      this.scmsCritCond = parse.cond;
      this.scmsCritChoices = parse.arr;
    }

    if (this.rule.beSelect && this.rule.beSelect.trim().length) {
      const parse = this.parseSelect(this.rule.beSelect);
      this.beCritCond = parse.cond;
      this.beCritChoices = parse.arr;
    }

  }

  parseSelect(str) {
    const rtn: AnyObj = {};
    const idx = str.indexOf('(');
    rtn.cond = str.substr(0, idx).trim();
    rtn.arr = str.substr(idx).replace(/(\(|\)|'|")/g, '').trim().split(',');
    rtn.arr = rtn.arr.map(x => x.trim());
    return rtn;
  }



}
