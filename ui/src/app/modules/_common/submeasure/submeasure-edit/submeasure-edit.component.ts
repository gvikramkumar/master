import {Component, OnInit, ViewChild} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {RuleService} from '../../services/rule.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {Observable, of} from 'rxjs';
import {MeasureService} from '../../services/measure.service';
import {Measure} from '../../models/measure';
import * as _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {SourceService} from '../../services/source.service';
import {Source} from '../../../../../../../shared/models/source';
import {DialogType} from '../../../../core/models/ui-enums';
import {GroupingSubmeasure} from '../../../../../../../server/api/common/submeasure/grouping-submeasure';
import {AbstractControl, AsyncValidatorFn, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Submeasure} from '../../models/submeasure';
import {shUtil} from '../../../../../../../shared/shared-util';
import {ToastService} from '../../../../core/services/toast.service';

@Component({
  selector: 'fin-submeasure-edit',
  templateUrl: './submeasure-edit.component.html',
  styleUrls: ['./submeasure-edit.component.scss']
})
export class SubmeasureEditComponent extends RoutingComponentBase implements OnInit {
  UiUtil = UiUtil;
  @ViewChild('form') form: NgForm;
  addMode = false;
  editMode = false;
  copyMode = false;
  submeasureNames: string[] = [];
  sm = new Submeasure();
  orgSubmeasure = _.cloneDeep(this.sm);
  measures: Measure[] = [];
  currentMeasure: Measure = new Measure;
  groupingSubmeasures: GroupingSubmeasure[] = [];
  sources: Source[] = [];
  rules: AllocationRule[] = [];
  errs: string[] = [];
  yearmos: { fiscalMonthName: string, fiscalMonth: number }[];
  COGS = ' Cogs '; // todo: move to lookup
  disableReportingLevels = [];
  disableCategories = false;
  BeIflDisabled = false;
  ProductIflDisabled = false;
  LegalIflDisabled = false;
  SalesIflDisabled = false;
  ScmsIflDisabled = false;
  BeMmDisabled = false;
  ProductMmDisabled = false;
  LegalMmDisabled = false;
  SalesMmDisabled = false;
  ScmsMmDisabled = false;
  ifl_switch_ibe = false;
  ifl_switch_le = false;
  ifl_switch_p = false;
  ifl_switch_s = false;
  ifl_switch_scms = false;
  mm_switch_ibe = false;
  mm_switch_le = false;
  mm_switch_p = false;
  mm_switch_s = false;
  mm_switch_scms = false;
  categoryTypes = [
    {
      name: 'Hardware',
      value: 'HW',
    },
    {
      name: 'Software',
      value: 'SW',
    },
    {
      name: 'HMP',
      value: 'HMP'
    },
    {
      name: 'Manual Mix',
      value: 'MM'
    }
  ];
  ibe_items = [
    {
      name: 'Internal BE',
      value: 'INTERNAL BE',
    },
    {
      name: 'Internal Sub BE',
      value: 'INTERNAL SUB BE',
    }
  ];
  le_items = [
    {
      name: 'Business Entity',
      value: 'BE',
    }
  ];
  p_items = [
    {
      name: 'Technology Group',
      value: 'TG',
    },
    {
      name: 'Business Unit',
      value: 'BU',
    },
    {
      name: 'Product Family',
      value: 'PF',
    },
    {
      name: 'Product ID',
      value: 'PID',
    }
  ];
  s_items = [
    {
      name: 'Level 1',
      value: 'LEVEL1',
    },
    {
      name: 'Level 2',
      value: 'LEVEL2',
    },
    {
      name: 'Level 3',
      value: 'LEVEL3',
    },
    {
      name: 'Level 4',
      value: 'LEVEL4',
    },
    {
      name: 'Level 5',
      value: 'LEVEL5',
    },
    {
      name: 'Level 6',
      value: 'LEVEL6',
    }
  ];
  scms_items = [
    {
      name: 'SCMS',
      value: 'SCMS',
    }
  ];
  timings = [
    {
      name: 'Daily',
      value: 1,
    },
    {
      name: 'Weekly',
      value: 2,
    },
    {
      name: 'Monthly',
      value: 3,
    },
    {
      name: 'Quarterly',
      value: 4,
    },
    {
      name: 'WD-5',
      value: 5,
    },
    {
      name: 'WD-4',
      value: 6,
    },
    {
      name: 'WD-3',
      value: 7,
    },
    {
      name: 'WD-2',
      value: 8,
    },
    {
      name: 'WD-1',
      value: 9,
    },
    {
      name: 'WD0',
      value: 10,
    },
    {
      name: 'WD+1',
      value: 11,
    },
    {
      name: 'WD+2',
      value: 12,
    },
    {
      name: 'WD+3',
      value: 13,
    },
    {
      name: 'WD+4',
      value: 14,
    },
    {
      name: 'WD+5',
      value: 15,
    }
  ];
  groupings = [
    {
      name: 'Indirect Revenue Adjustments',
      value: 'Indirect Revenue',
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private measureService: MeasureService,
    private sourceService: SourceService,
    private uiUtil: UiUtil,
    private toastService: ToastService
  ) {
    super(store, route);
    if (!this.route.snapshot.params.mode) {
      throw new Error('Edit page called with no add/edit/copy mode');
    }
    this.addMode = this.route.snapshot.params.mode === 'add';
    this.editMode = this.route.snapshot.params.mode === 'edit';
    this.copyMode = this.route.snapshot.params.mode === 'copy';
  }

  ngOnInit() {
    this.yearmos = shUtil.getFiscalMonthListFromDate(new Date(), 6);
    const promises: Promise<any>[] = [
      this.measureService.getMany().toPromise(),
      this.ruleService.getManyActive().toPromise(),
      this.sourceService.getMany().toPromise(),
      this.submeasureService.getDistinctSubmeasureNames().toPromise()
    ];
    if (this.editMode || this.copyMode) {
      promises.push(this.submeasureService.getOneById(this.route.snapshot.params.id).toPromise());
    }
    Promise.all(promises)
      .then(results => {
        this.measures = _.sortBy(results[0], 'name');
        this.rules = _.sortBy(results[1], 'name');
        this.sources = _.sortBy(results[2], 'name');
        this.submeasureNames = results[3].map(x => x.toUpperCase());

        if (this.copyMode) {
          this.sm = results[4];
          this.sm.approvedOnce = 'N';
          delete this.sm.createdBy;
          delete this.sm.createdDate;
          this.orgSubmeasure = _.cloneDeep(this.sm);
        }
        if (this.editMode) {
          this.sm = results[4];
          if (_.includes(['A', 'I'], this.sm.status)) {
            delete this.sm.createdBy;
            delete this.sm.createdDate;
          }
          this.orgSubmeasure = _.cloneDeep(this.sm);
          this.submeasureNames = _.without(this.submeasureNames, this.sm.name.toUpperCase());
        }
        this.init();
      });
  }

  init() {
    if (this.sm.rules.length === 0) {
      this.sm.rules[0] = '';
    }
    this.syncFilerLevelSwitches();
    this.syncManualMapSwitches();
    this.measureChange(true);
  }

  isManualMapping() {
    return this.sm.indicators.manualMapping === 'Y';
  }

  showDeleteRuleIcon() {
    return this.sm.rules.length > 1;
  }

  showAddRuleIcon() {
    return this.sm.rules.length < 5;
  }

  removeRule(i) {
    this.sm.rules.splice(i, 1);
  }

  addRule(i) {
    this.sm.rules.splice(i + 1, 0, '');
  }

  // todo: make sure this hasn't changed, it's 4 currently
  sourceChange() {
    this.sm.indicators.dollarUploadFlag = shUtil.isManualUploadSource(this.sm.sourceId) ? 'Y' : 'N';
  }

  isCogsMeasure() {
    return _.find(this.measures, {measureId: this.sm.measureId})
      .name.indexOf(this.COGS) !== -1;
  }

  measureChange(init = false) {
    if (!this.sm.measureId) { // no measure in "add" mode
      return;
    }

    if (this.isCogsMeasure()) {
      this.disableCategories = false;
    } else {
      this.disableCategories = true;
      this.sm.categoryType = 'HW';
    }

    this.submeasureService.callMethod('getGroupingSubmeasures', {measureId: this.sm.measureId})
      .subscribe(groupingSubmeasures => {
        this.groupingSubmeasures = groupingSubmeasures;
        if (!init) {
          this.sm.groupingSubmeasureId = undefined;
        }
      });

    this.currentMeasure = _.find(this.measures, {measureId: this.sm.measureId});
    this.disableReportingLevels[0] = !this.currentMeasure.reportingLevel1Enabled;
    this.disableReportingLevels[1] = !this.currentMeasure.reportingLevel2Enabled;
    this.disableReportingLevels[2] = !this.currentMeasure.reportingLevel3Enabled;

    this.sm.reportingLevels[0] = this.currentMeasure.reportingLevel1 ? this.currentMeasure.reportingLevel1 :
      (this.currentMeasure.reportingLevel1Enabled ? this.sm.reportingLevels[0] : undefined);
    this.sm.reportingLevels[1] = this.currentMeasure.reportingLevel2 ? this.currentMeasure.reportingLevel2 :
      (this.currentMeasure.reportingLevel2Enabled ? this.sm.reportingLevels[1] : undefined);
    this.sm.reportingLevels[2] = this.currentMeasure.reportingLevel3 ? this.currentMeasure.reportingLevel3 :
      (this.currentMeasure.reportingLevel3Enabled ? this.sm.reportingLevels[2] : undefined);

  }

  iflChange(sw) {
    // if Internal Business Entity is selected, make Product disabled, and vice-versa.
    // undo disabled when unselected
    // if anything is selected in ifl, disable in mm
    switch (sw) {
      case 'ibe' :
        if (this.ifl_switch_ibe) {
          this.mm_switch_ibe = false;
          this.ifl_switch_p = false;
          this.ProductIflDisabled = true;
          this.BeMmDisabled = true;
          this.ProductMmDisabled = true;
          this.sm.inputFilterLevel.productLevel = undefined;
        } else {
          this.ProductIflDisabled = false;
          this.BeMmDisabled = false;
          this.ProductMmDisabled = false;
        }
        break;
      case 'p' :
        if (this.ifl_switch_p) {
          this.ifl_switch_ibe = false;
          this.BeIflDisabled = true;
          this.ProductMmDisabled = true;
          this.sm.inputFilterLevel.internalBELevel = undefined;
        } else {
          this.BeIflDisabled = false;
          this.ProductMmDisabled = false;
        }
        break;
      case 'le' :
        if (this.ifl_switch_le) {
          this.LegalMmDisabled = true;
          this.sm.manualMapping.entityLevel = undefined;
        } else {
          this.LegalMmDisabled = false;
        }
        break;
      case 's' :
        if (this.ifl_switch_s) {
          this.SalesMmDisabled = true;
          this.sm.manualMapping.salesLevel = undefined;
        } else {
          this.SalesMmDisabled = false;
        }
        break;
      case 'scms' :
        if (this.ifl_switch_scms) {
          this.ScmsMmDisabled = true;
          this.sm.manualMapping.scmsLevel = undefined;
        } else {
          this.ScmsMmDisabled = false;
        }
        break;
    }
  }

  mmChange(sw) {
    // if Internal Business Entity is selected, disable product
    // disable corresponding value in ifl
    
    switch (sw) {
      case 'ibe' :
        if (this.mm_switch_ibe) {
          this.ifl_switch_ibe = false;
          this.mm_switch_p = false;
          this.ProductMmDisabled = true;
          this.BeIflDisabled = true;
          this.sm.manualMapping.productLevel = undefined;
          this.sm.manualMapping.internalBELevel = undefined;
        } else {
          this.ProductMmDisabled = false;
          this.BeIflDisabled = false;
        }
        break;
      case 'p' :
        if (this.mm_switch_p) {
          this.mm_switch_ibe = false;
          this.BeMmDisabled = true;
          this.ProductIflDisabled = true;
          this.sm.manualMapping.internalBELevel = undefined;
          this.sm.inputFilterLevel.productLevel = undefined;
        } else {
          this.BeMmDisabled = false;
          this.ProductIflDisabled = false;
        }
        break;
      case 'le' :
        if (this.mm_switch_le) {
          this.LegalIflDisabled = true;
          this.sm.inputFilterLevel.entityLevel = undefined;
        } else {
          this.LegalIflDisabled = false;
        }
        break;
      case 's' :
        if (this.mm_switch_s) {
          this.SalesIflDisabled = true;
          this.sm.inputFilterLevel.salesLevel = undefined;
        } else {
          this.SalesIflDisabled = false;
        }
        break;
      case 'scms' :
        if (this.mm_switch_scms) {
          this.ScmsIflDisabled = true;
          this.sm.inputFilterLevel.scmsLevel = undefined;
        } else {
          this.ScmsIflDisabled = false;
        }
        break;
    }
  }

  mmSelect() {
    // if manual mapping is unselected, clear out the values
    if (this.sm.indicators.manualMapping ===  'N') {
      this.mm_switch_ibe = false;
      this.mm_switch_p = false;
      this.mm_switch_le = false;
      this.mm_switch_s = false;
      this.mm_switch_scms = false;

      this.sm.manualMapping.internalBELevel = undefined;
      this.sm.manualMapping.productLevel = undefined;
      this.sm.manualMapping.entityLevel = undefined;
      this.sm.manualMapping.salesLevel = undefined;
      this.sm.manualMapping.scmsLevel = undefined;

      this.mmChange('ibe');
      this.mmChange('p');
      this.mmChange('le');
      this.mmChange('s');
      this.mmChange('scms');
    }
  }

  syncFilerLevelSwitches() {
    this.ifl_switch_ibe = !!this.sm.inputFilterLevel.internalBELevel;
    this.ifl_switch_p = !!this.sm.inputFilterLevel.productLevel;
    this.ifl_switch_le = !!this.sm.inputFilterLevel.entityLevel;
    this.ifl_switch_s = !!this.sm.inputFilterLevel.salesLevel;
    this.ifl_switch_scms = !!this.sm.inputFilterLevel.scmsLevel;
  }

  syncManualMapSwitches() {
    this.mm_switch_ibe = !!this.sm.manualMapping.internalBELevel;
    this.mm_switch_p = !!this.sm.manualMapping.productLevel;
    this.mm_switch_le = !!this.sm.manualMapping.entityLevel;
    this.mm_switch_s = !!this.sm.manualMapping.salesLevel;
    this.mm_switch_scms = !!this.sm.manualMapping.scmsLevel;
  }

  cleanIflSwitchChoices() {
    if (!this.ifl_switch_ibe) {
      delete this.sm.inputFilterLevel.internalBELevel;
    }
    if (!this.ifl_switch_p) {
      delete this.sm.inputFilterLevel.productLevel;
    }
    if (!this.ifl_switch_le) {
      delete this.sm.inputFilterLevel.entityLevel;
    }
    if (!this.ifl_switch_s) {
      delete this.sm.inputFilterLevel.salesLevel;
    }
    if (!this.ifl_switch_scms) {
      delete this.sm.inputFilterLevel.scmsLevel;
    }
  }

  cleanMMSwitchChoices() {
    if (!this.isManualMapping() || !this.mm_switch_ibe) {
      delete this.sm.manualMapping.internalBELevel;
    }
    if (!this.isManualMapping() || !this.mm_switch_p) {
      delete this.sm.manualMapping.productLevel;
    }
    if (!this.isManualMapping() || !this.mm_switch_le) {
      delete this.sm.manualMapping.entityLevel;
    }
    if (!this.isManualMapping() || !this.mm_switch_s) {
      delete this.sm.manualMapping.salesLevel;
    }
    if (!this.isManualMapping() || !this.mm_switch_scms) {
      delete this.sm.manualMapping.scmsLevel;
    }
  }

  cleanUp() {
    this.cleanIflSwitchChoices();
    this.cleanMMSwitchChoices();
    this.sm.rules = this.sm.rules.filter(r => !!r);
  }

  hasChanges() {
    return !_.isEqual(this.sm, this.orgSubmeasure);
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
          this.router.navigateByUrl('/prof/submeasure');
        }
      });
  }

  reset() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          {
            this.sm = _.cloneDeep(this.orgSubmeasure);
            this.init();
          }
        }
      });
  }

  validateSaveToDraft() {
    const errors = [];
    if (!(this.sm.name && this.sm.name.trim())) {
      errors.push('You must define a name to save to draft.');
    }
    if (_.includes(this.submeasureNames, this.sm.name)) {
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
      const saveMode = UiUtil.getApprovalSaveMode(this.sm.status, this.addMode, this.editMode, this.copyMode);
      this.submeasureService.saveToDraft(this.sm, {saveMode})
        .subscribe(sm => {
          this.toastService.showAutoHideToast('Save To Draft', 'Submeasure saved to draft.');
          this.sm = sm;
        });
    }
  }

  reject() {
    this.uiUtil.genericDialog('Enter a reason for rejection:')
      .subscribe(result => {
        if (result) {
          this.cleanUp();
          this.submeasureService.reject(this.sm)
            .subscribe(sm => {
              this.toastService.showAutoHideToast('Approval Rejected', 'Submeasure has been rejected, user notified.');
              this.router.navigateByUrl('/prof/submeasure');
            });
        }
      });
  }

  approve() {
    UiUtil.triggerBlur('.fin-edit-container form');
    UiUtil.waitForAsyncValidations(this.form)
      .then(() => {
        if (this.form.valid) {
          this.uiUtil.confirmApprove()
            .subscribe(result => {
              if (result) {
                this.cleanUp();
                const errs = this.validate();
                if (errs) {
                  this.uiUtil.genericDialog('Validation Errors', this.errs.join('\n'));
                  return;
                } else {
                  this.submeasureService.approve(this.sm)
                    .subscribe(() => {
                      this.toastService.showAutoHideToast('Approval Approved', 'Submeasure approved, user notified.');
                      this.router.navigateByUrl('/prof/submeasure');
                    });
                }
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
                const errs = this.validate();
                if (errs) {
                  this.uiUtil.genericDialog('Validation Errors', this.errs.join('\n'));
                  return;
                } else {
                  const saveMode = UiUtil.getApprovalSaveMode(this.sm.status, this.addMode, this.editMode, this.copyMode);
                  this.submeasureService.submitForApproval(this.sm, {saveMode})
                    .subscribe(() => {
                      this.toastService.showAutoHideToast('Approval Submitted', 'Submeasure submitted for approval.');
                      this.router.navigateByUrl('/prof/submeasure');
                    });
                }
              }
            });
        }
      });
  }

  validate() {
    this.errs = [];
    const sm = this.sm;
    if (sm.rules.length > _.uniq(sm.rules).length) {
      this.errs.push('Duplicate rules entered');
    }
    if (this.noIflMmSelected()) {
      this.errs.push('No value entered for Input Filter Level or Manual Mapping');
    }
    return this.errs.length ? this.errs : null;
  }

  noIflMmSelected(): boolean {
    if (this.ifl_switch_ibe ||
      this.ifl_switch_p ||
      this.ifl_switch_le ||
      this.ifl_switch_s ||
      this.ifl_switch_scms ||
      this.mm_switch_ibe ||
      this.mm_switch_p ||
      this.mm_switch_le ||
      this.mm_switch_s ||
      this.mm_switch_scms) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {

  }
}
