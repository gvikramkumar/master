import {Component, OnInit, ViewChild} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {RuleService} from '../../services/rule.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {of} from 'rxjs';
import {MeasureService} from '../../services/measure.service';
import {Measure} from '../../models/measure';
import * as _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {SourceService} from '../../services/source.service';
import {Source} from '../../../../../../../shared/models/source';
import {DialogInputType, DialogSize, DialogType} from '../../../../core/models/ui-enums';
import {NgForm} from '@angular/forms';
import {Submeasure} from '../../../../../../../shared/models/submeasure';
import {shUtil} from '../../../../../../../shared/shared-util';
import {PgLookupService} from '../../services/pg-lookup.service';
import {ProductClassUploadService} from '../../../prof/services/product-class.service';
import {environment} from '../../../../../environments/environment';
import {FsFile} from '../../models/fsfile';
import {BusinessUploadFileType, Directory} from '../../../../../../../shared/enums';
import {FsFileService} from '../../../../core/services/fsfile.service';
import {BusinessUploadService} from '../../services/business-upload.service';

@Component({
  selector: 'fin-submeasure-edit',
  templateUrl: './submeasure-edit.component.html',
  styleUrls: ['./submeasure-edit.component.scss']
})
export class SubmeasureEditComponent extends RoutingComponentBase implements OnInit {
  deptUploadFilename: string;
  deptUploadTemplate: FsFile;
  manualMixHw: number;
  manualMixSw: number;
  startFiscalMonth: string;
  flashCategories = [];
  adjustmentTypes = [];
  flashCategory: number;
  adjustmentType: number;
  sourceAdjCategories: {name: string, value: number}[] = [];
  arrRules: string[] = [];
  UiUtil = UiUtil;
  @ViewChild('form') form: NgForm;
  @ViewChild('fileInput') fileInput;
  addMode = false;
  viewMode = false;
  editMode = false;
  copyMode = false;
  submeasureNames: string[] = [];
  sm = new Submeasure();
  orgSubmeasure: Submeasure;
  measures: Measure[] = [];
  currentMeasure: Measure = new Measure;
  groupingSubmeasuresAll = [];
  groupingSubmeasures = [];
  sources: Source[];
  measureSources: Source[] = [];
  rules: AllocationRule[] = [];
  errs: string[] = [];
  yearmos: { fiscalMonthName: string, fiscalMonth: number }[];
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
      value: 'Manual Mix'
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
    {name: 'Daily'},
    {name: 'Weekly'},
    {name: 'Monthly'},
    {name: 'Quarter'},
    {name: 'WD-5'},
    {name: 'WD-4'},
    {name: 'WD-3'},
    {name: 'WD-2'},
    {name: 'WD-1'},
    {name: 'WD0'},
    {name: 'WD+1'},
    {name: 'WD+2'},
    {name: 'WD+3'},
    {name: 'WD+4'},
    {name: 'WD+5'},
  ];
  pnlNodesAll = [];
  pnlNodes = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private measureService: MeasureService,
    private sourceService: SourceService,
    private uiUtil: UiUtil,
    private pgLookupService: PgLookupService,
    private fsFileService: FsFileService,
    private productClassUploadService: ProductClassUploadService,
    private businessUploadService: BusinessUploadService
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

  ngOnInit() {
    this.yearmos = shUtil.getFiscalMonthListFromDate(new Date(), 6);
    const promises: Promise<any>[] = [
      this.measureService.getManyActive().toPromise(),
      this.ruleService.getManyLatestGroupByNameActive().toPromise(),
      this.sourceService.getMany().toPromise(),
      this.submeasureService.getDistinct('name', {moduleId: -1}).toPromise(),
      this.pgLookupService.callRepoMethod('getSubmeasurePNLNodes', null, {moduleId: this.store.module.moduleId}).toPromise(),
      this.fsFileService.getInfoMany({directory: Directory.profBusinessUpload, buFileType: BusinessUploadFileType.template, buUploadType: 'dept-upload'}).toPromise()
    ];
    if (!this.addMode) {
      promises.push(this.submeasureService.getOneById(this.route.snapshot.params.id).toPromise());
    }
    Promise.all(promises)
      .then(results => {
        this.measures = _.sortBy(results[0], 'name');
        this.rules = _.sortBy(results[1], 'name');
        this.sources = _.sortBy(results[2], 'name');
        this.submeasureNames = results[3];
        this.pnlNodesAll = results[4];
        this.deptUploadTemplate = results[5][0];

        if (this.viewMode || this.editMode || this.copyMode) {
          this.sm = results[6];
        }
        if (this.viewMode) {
          this.startFiscalMonth = shUtil.getFiscalMonthLongNameFromNumber(this.sm.startFiscalMonth);
        } else {
          // they need to pick a new effective month is it's not in the last 6 months.
          UiUtil.clearPropertyIfNotInList(this.sm, 'startFiscalMonth', this.yearmos, 'fiscalMonth');
        }
        if (this.copyMode) {
          this.sm.approvedOnce = 'N';
          delete this.sm.submeasureKey;
          delete this.sm.submeasureId;
          delete this.sm.createdBy;
          delete this.sm.createdDate;
          // we'll reset these for each edit
          this.sm.manualMixHw = undefined;
          this.sm.manualMixSw = undefined;
          if (this.isDeptUpload()) {
            this.sm.indicators.deptAcct = 'Y';
          }
        }
        if (this.editMode) {
          if (_.includes(['A', 'I'], this.sm.status)) {
            delete this.sm.createdBy;
            delete this.sm.createdDate;
            if (this.isDeptUpload()) {
              this.sm.indicators.deptAcct = 'Y';
            }
          }
          this.submeasureNames = _.without(this.submeasureNames, this.sm.name.toUpperCase());
        }
        this.orgSubmeasure = _.cloneDeep(this.sm);
        this.init();
      })
      .then(() => {
        const promises2: Promise<any>[] = [
          this.pgLookupService.getSubmeasureFlashCategories(this.sm.submeasureKey || 0).toPromise(),
          this.pgLookupService.getSubmeasureAdjustmentTypes(this.sm.submeasureKey || 0).toPromise(),
        ]
        if (!this.addMode) {
          promises2.push(this.productClassUploadService.callMethod('getManualMixValuesForSubmeasureName', {submeasureName: this.sm.name}).toPromise());
        }
        return Promise.all(promises2)
          .then(results => {
            this.flashCategories = results[0];
            this.adjustmentTypes = results[1];
            if (!this.addMode) {
              // if !addMode and draft or pending, then use value from sm, else get value from database (if it exists)
              if (_.includes(['D', 'P'], this.sm.status) && this.sm.manualMixHw && this.sm.manualMixSw) {
                this.manualMixHw = this.sm.manualMixHw;
                this.manualMixSw = this.sm.manualMixSw;
              } else if (results[2]) {
                this.manualMixHw = results[2].HW;
                this.manualMixSw = results[2].SW;
              }
            }
          });
      });
  }

  init() {
    /*
    why arrRules and not just use sm.rules in ngFor and everywhere else instead?
    There's a couple bugs when we do this.
    1. if first rule chosen, then plus sign hit, clears out first entry, even though it's still in array
    2. everytime you pick in one, it creates a new cuiSelect, then crashes on it's focusOnInput I think, as it can no longer find the old id=select-{{guid}}
    Not sure what's going on, just that having separate arrays for ngModel and ngFor fixes it.
     */
    this.arrRules = _.cloneDeep(this.sm.rules);
    if (this.arrRules.length === 0) {
      this.arrRules[0] = '';
    }
    this.syncFilerLevelSwitches();
    this.syncManualMapSwitches();
    this.measureChange(true);
    if (this.hasFlashCategory()) {
      this.flashCategory = this.sm.sourceSystemAdjTypeId;
    } else
    if (this.hasAdjustmentType()) {
      this.adjustmentType = this.sm.sourceSystemAdjTypeId;
    }

    this.deptUploadFilename = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  hasFlashCategory() {
    // Manufacturing V&O and MRAP
    return this.sm.measureId === 3 && this.sm.sourceId === 2;
  }

  hasAdjustmentType() {
    // Indirect Revenue Adjustments AND RRR
    return this.sm.measureId === 1 && this.sm.sourceId === 1;
  }

  isManualMapping() {
    return this.sm.indicators.manualMapping === 'Y';
  }

  showDeleteRuleIcon() {
    return this.arrRules.length > 1;
  }

  showAddRuleIcon() {
    return this.arrRules.length < 15;
  }

  removeRule(i) {
    this.arrRules.splice(i, 1);
  }

  addRule(i) {
    this.arrRules.splice(i + 1, 0, '');
  }

  // todo: make sure this hasn't changed, it's 4 currently
  sourceChange() {
    this.sm.indicators.dollarUploadFlag = shUtil.isManualUploadSource(this.sm.sourceId) ? 'Y' : 'N';

    if (!this.hasFlashCategory()) {
      this.flashCategory = undefined;
    }
    if (!this.hasAdjustmentType()) {
      this.adjustmentType = undefined;
    }
  }

  isCogsMeasure() {
    const measure = _.find(this.measures, {measureId: this.sm.measureId});
    return measure && measure.isCogsMeasure === 'Y';
  }

  measureChange(init?) {
    if (!this.sm.measureId) { // no measure in "add" mode
      return;
    }

    if (this.isCogsMeasure()) {
      this.disableCategories = false;
    } else {
      this.disableCategories = true;
      if (init) {
        // we have some values that violate the rules (a non-cogs that has SW) that we need to show
        // but only on load. If they change measure then we want to force HW on non-cogs
        this.sm.categoryType = this.sm.categoryType || 'HW';
      } else {
        this.sm.categoryType = 'HW';
      }
    }

    this.submeasureService.callMethod('getGroupingSubmeasures', {measureId: this.sm.measureId})
      .subscribe(groupingSubmeasures => {
        this.groupingSubmeasuresAll = groupingSubmeasures;
        this.filterGroupingSubmeasuresIfService();
        UiUtil.clearPropertyIfNotInList(this.sm, 'groupingSubmeasureId', this.groupingSubmeasures, 'submeasureKey');
      });

    this.currentMeasure = _.find(this.measures, {measureId: this.sm.measureId});
    if (!this.currentMeasure) {
      throw new Error(`Measure not found for measureId: ${this.sm.measureId}`);
    }
    this.measureSources = this.sources.filter(source => _.includes(this.currentMeasure.sources, source.sourceId));
    UiUtil.clearPropertyIfNotInList(this.sm, 'sourceId', this.measureSources, 'sourceId');

    this.sm.reportingLevels[0] = this.currentMeasure.reportingLevels[0] ? this.currentMeasure.reportingLevels[0] : (init ? this.sm.reportingLevels[0] : undefined);
    this.sm.reportingLevels[1] = this.currentMeasure.reportingLevels[1] ? this.currentMeasure.reportingLevels[1] : (init ? this.sm.reportingLevels[1] : undefined);
    if (this.currentMeasure.reportingLevel3SetToSubmeasureName) {
      this.sm.reportingLevels[2] = this.sm.name;
    } else {
      this.sm.reportingLevels[2] = this.currentMeasure.reportingLevels[2] ? this.currentMeasure.reportingLevels[2] : (init ? this.sm.reportingLevels[2] : undefined);
    }

    this.pnlNodes = this.pnlNodesAll.filter(x => x.measure_id === this.sm.measureId);
    UiUtil.clearPropertyIfNotInList(this.sm, 'pnlnodeGrouping', this.pnlNodes, 'pnlnode_grouping');
  }

  isService() {
    return this.sm.indicators.service === 'Y';
  }

  filterGroupingSubmeasuresIfService() {
    const sms = _.clone(this.groupingSubmeasuresAll);
    if (this.isService()) {
      this.groupingSubmeasures = sms.filter(sm => sm.indicators.service === 'Y');
    } else {
      this.groupingSubmeasures = sms.filter(sm => sm.indicators.service === 'N');
    }
  }

  updateReportingLevel3() {
    if (this.currentMeasure.reportingLevel3SetToSubmeasureName) {
      this.sm.reportingLevels[2] = this.sm.name;
    }  }

  iflChange(sw) {
    // if Internal Business Entity is selected, make Product disabled, and vice-versa.
    // undo disabled when unselected
    // if anything is selected in ifl, disable in mm
    switch (sw) {
      case 'ibe' :
        if (this.ifl_switch_ibe) {
          this.ifl_switch_p = false;
          this.mm_switch_ibe = false;
          this.mm_switch_p = false;
          this.ProductIflDisabled = true;
          this.BeMmDisabled = true;
          this.ProductMmDisabled = true;
        } else {
          this.sm.inputFilterLevel.internalBELevel = undefined;
          this.ProductIflDisabled = false;
          this.BeMmDisabled = false;
          this.ProductMmDisabled = false;
        }
        break;
      case 'p' :
        if (this.ifl_switch_p) {
          this.ifl_switch_ibe = false;
          this.mm_switch_ibe = false;
          this.mm_switch_p = false;
          this.BeIflDisabled = true;
          this.BeMmDisabled = true;
          this.ProductMmDisabled = true;
        } else {
          this.sm.inputFilterLevel.productLevel = undefined;
          this.BeIflDisabled = false;
          this.BeMmDisabled = false;
          this.ProductMmDisabled = false;
        }
        break;
      case 'le' :
        if (this.ifl_switch_le) {
          this.LegalMmDisabled = true;
        } else {
          this.sm.inputFilterLevel.entityLevel = undefined;
          this.LegalMmDisabled = false;
        }
        break;
      case 's' :
        if (this.ifl_switch_s) {
          this.SalesMmDisabled = true;
        } else {
          this.sm.inputFilterLevel.salesLevel = undefined;
          this.SalesMmDisabled = false;
        }
        break;
      case 'scms' :
        if (this.ifl_switch_scms) {
          this.ScmsMmDisabled = true;
        } else {
          this.sm.inputFilterLevel.scmsLevel = undefined;
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
          this.mm_switch_p = false;
          this.ifl_switch_ibe = false;
          this.ifl_switch_p = false;
          this.ProductMmDisabled = true;
          this.BeIflDisabled = true;
          this.ProductIflDisabled = true;
        } else {
          this.sm.manualMapping.internalBELevel = undefined;
          this.ProductMmDisabled = false;
          this.BeIflDisabled = false;
          this.ProductIflDisabled = false;
        }
        break;
      case 'p' :
        if (this.mm_switch_p) {
          this.mm_switch_ibe = false;
          this.ifl_switch_ibe = false;
          this.ifl_switch_p = false;
          this.BeMmDisabled = true;
          this.BeIflDisabled = true;
          this.ProductIflDisabled = true;
        } else {
          this.sm.manualMapping.productLevel = undefined;
          this.BeMmDisabled = false;
          this.BeIflDisabled = false;
          this.ProductIflDisabled = false;
        }
        break;
      case 'le' :
        if (this.mm_switch_le) {
          this.LegalIflDisabled = true;
        } else {
          this.sm.manualMapping.entityLevel = undefined;
          this.LegalIflDisabled = false;
        }
        break;
      case 's' :
        if (this.mm_switch_s) {
          this.SalesIflDisabled = true;
        } else {
          this.sm.manualMapping.salesLevel = undefined;
          this.SalesIflDisabled = false;
        }
        break;
      case 'scms' :
        if (this.mm_switch_scms) {
          this.ScmsIflDisabled = true;
        } else {
          this.sm.manualMapping.scmsLevel = undefined;
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

  clearAllocationRequired() {
    if (this.sm.indicators.groupFlag === 'N') {
      this.sm.indicators.allocationRequired = 'N';
    }
  }

  cleanUp() {
    this.cleanIflSwitchChoices();
    this.cleanMMSwitchChoices();
    // the list size is governed by arrRules, BUT, the values are in sm.rules
    this.arrRules.forEach((x, idx) => this.arrRules[idx] = this.sm.rules[idx]);
    this.arrRules = this.arrRules.filter(r => !!r);
    this.sm.rules = _.cloneDeep(this.arrRules);
    if (this.arrRules.length === 0) {
      this.arrRules[0] = '';
    }
    if (this.hasFlashCategory()) {
      this.sm.sourceSystemAdjTypeId = this.flashCategory;
    } else if (this.hasAdjustmentType()) {
      this.sm.sourceSystemAdjTypeId = this.adjustmentType;
    } else {
      this.sm.sourceSystemAdjTypeId = undefined;
    }
    if (this.isManualMix()) {
      this.sm.manualMixHw = this.manualMixHw;
      this.sm.manualMixSw = this.manualMixSw;
    }
    this.clearAllocationRequired();
    if (this.isDeptUpload() && this.sm.indicators.deptAcct === 'N') {
      this.sm.indicators.deptAcct = 'Y';
    }

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
          history.go(-1);
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
    if (!(this.sm.measureId)) {
      errors.push('You must choose a measure to save to draft.');
    }
    if (!(this.sm.name && this.sm.name.trim())) {
      errors.push('You must define a name to save to draft.');
    }
    return errors.length ? errors : null;
  }

  saveToDraft() {
    UiUtil.waitForAsyncValidations(this.form)
      .then(() => {
        this.cleanUp();
        const errors = this.validateSaveToDraft();
        if (errors) {
          this.uiUtil.validationErrorsDialog(errors);
        } else {
          const saveMode = UiUtil.getApprovalSaveMode(this.sm.status, this.addMode, this.editMode, this.copyMode);
          this.submeasureService.saveToDraft(this.sm, {saveMode})
            .subscribe(sm => {
              // once saved we need to update, not add, so move mode to edit (uiUtil.getApprovalSaveMode())
              this.addMode = false;
              this.copyMode = false;
              this.editMode = true;
              this.sm = sm;
              this.uiUtil.toast('Submeasure saved to draft.');
            });
        }
      });
  }

  reject() {
    this.uiUtil.confirmReject('submeasure')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                this.sm.approveRejectMessage = resultPrompt;
                this.cleanUp();
                this.submeasureService.reject(this.sm)
                  .subscribe(sm => {
                    this.uiUtil.toast('Submeasure has been rejected, user notified.');
                    history.go(-1);
                  });
              }
            });
        }
      });
  }

  approve() {
    this.uiUtil.confirmApprove('submeasure')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                this.sm.approveRejectMessage = resultPrompt;
                this.cleanUp();
                this.submeasureService.approve(this.sm)
                  .subscribe(() => {
                    this.uiUtil.toast('Submeasure approved, user notified.');
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
          const errs = this.validate();
          if (errs) {
            this.uiUtil.genericDialog('Validation Errors', this.errs.join('\n'), null, DialogType.ok, DialogSize.medium);
            return;
          }
          this.uiUtil.confirmSubmitForApproval()
            .subscribe(result => {
              if (result) {
                const saveMode = UiUtil.getApprovalSaveMode(this.sm.status, this.addMode, this.editMode, this.copyMode);
                this.submeasureService.submitForApproval(this.sm, {saveMode})
                  .subscribe(() => {
                    this.uiUtil.toast('Submeasure submitted for approval.');
                    history.go(-1);
                  });
              }
            });
        }
      });
  }

  validate() {
    this.errs = [];

    // rules specify if allocation will happen or not, so we'll focus on them only, i.e. not be bothered
    // if they add an effective date for passthrough, just focus on: should there be rules or not be rules
    if (this.isUnallocatedGroup()) {
      if (this.isUnallocatedGroup() && this.sm.rules.length) {
        this.errs.push('No rules allowed on Grouping Sub-Measures without Allocation Required checked');
      }
    } else if (this.isPassThrough()) {
      if (this.isPassThrough() && this.sm.rules.length) {
        this.errs.push('No rules allowed on Pass Through Sub-Measures');
      }
    } else {
      if (!this.sm.rules.length) {
        this.errs.push('No rules specified');
      }

      if (this.sm.rules.length > _.uniq(this.sm.rules).length) {
        this.errs.push('Duplicate rules entered');
      }
      // this shouldn't have to be here, but currently we have a bug where form.valid === true even though this control
      // is highlighted red with required: true error
      if (!UiUtil.isValidFiscalMonth(this.sm.startFiscalMonth)) {
        this.errs.push(`No "Effective Month" value`);
      }

      if (this.isManualMix()) {
        const hw = Number(this.sm.manualMixHw);
        const sw = Number(this.sm.manualMixSw);
        if (isNaN(hw)) {
          this.errs.push(`Manual Mix HW value, not a number: ${this.sm.manualMixHw}`);
        }
        if (isNaN(sw)) {
          this.errs.push(`Manual Mix SW value, not a number: ${this.sm.manualMixSw}`);
        }
        if (!isNaN(hw) && !isNaN(sw) && hw + sw !== 100.0) {
          this.errs.push(`Manual Mix HW/SW values do not add up to 100`);
        }
      }

      if (!this.validateManualMapping()) {
        this.errs.push('Manual Mapping selected, but no value entered');
      }
    }

    this.errs = this.errs.map(err => `* ${err}`)
    return this.errs.length ? this.errs : null;
  }

    validateManualMapping() {
    if (
      this.isManualMapping() &&
      !(this.mm_switch_ibe || this.mm_switch_p || this.mm_switch_le || this.mm_switch_s || this.mm_switch_scms)) {
      return false;
    } else {
      return true;
    }
  }

  // std cogs adj and mfg overhead measures (2 & 4) AND sm has EXPSSOT MFGO source (#3)
  isDeptUpload() {
    return shUtil.isDeptUpload(this.sm);
  }
  
  isGroupingParent() {
    return this.sm.indicators.groupFlag === 'Y';
  }

  isManualMix() {
    return this.sm.categoryType === 'Manual Mix';
  }

  isPassThrough() {
    return this.sm.indicators.passThrough === 'Y';
  }

  isUnallocatedGroup() {
    return this.sm.indicators.groupFlag === 'Y' && this.sm.indicators.allocationRequired === 'N';
  }

  isAllocatedGroup() {
    return this.sm.indicators.groupFlag === 'Y' && this.sm.indicators.allocationRequired === 'Y';
  }

  changeFile(fileInput) {
    this.deptUploadFilename = fileInput.files[0] && fileInput.files[0].name;
  }

  getUploadedText() {
    if (this.deptUploadFilename) {
      return 'File:';
    } else if (this.sm.indicators.deptAcct === 'A') {
      return 'Uploaded';
    }
  }

  doDeptUpload(fileInput) {
    if (!this.sm.name || this.sm.name.trim().length === 0) {
      this.uiUtil.genericDialog('No submeasure name');
      return;
    }
    this.businessUploadService.uploadFile(fileInput, 'dept-upload', this.sm.name)
      .then(result => {
        if (result.status === 'success') {
          this.sm.indicators.deptAcct = 'A';
        } else {
          this.sm.indicators.deptAcct = 'Y';
        }
        this.deptUploadFilename = '';
      });
  }

  getDeptUploadExistingMappingClick() {
    if (!this.sm.name || this.sm.name.trim().length === 0) {
      this.uiUtil.genericDialog('No submeasure name');
      return;
    }
  }

  getDeptUploadExistingMappingUri() {
    if (!this.sm.name || this.sm.name.trim().length === 0) {
      return 'javascript:void(0)';
    }
    return `${environment.apiUrl}/api/submeasure/call-method/downloadDeptUploadMapping?moduleId=1&submeasureName=${encodeURI(this.sm.name)}`;
  }

  getDeptUploadTemplateDownloadUri() {
    if (!this.deptUploadTemplate) {
      return;
    }
    return `${environment.apiUrl}/api/file/${this.deptUploadTemplate.id}`;
  }

}
