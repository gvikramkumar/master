import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {Submeasure} from '../../models/submeasure';
import {AppStore} from '../../../../app/app-store';
import {RuleService} from '../../services/rule.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {AllocationRule} from '../../models/allocation-rule';
import {Observable, of} from 'rxjs';
import {MeasureService} from '../../services/measure.service';
import {Measure} from '../../models/measure';
import * as _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {SourceService} from '../../services/source.service';
import {Source} from '../../models/source';
import {DialogType} from '../../../../core/models/ui-enums';
import {GroupingSubmeasure} from '../../../../../../../server/api/common/submeasure/grouping-submeasure';

@Component({
  selector: 'fin-submeasure-edit',
  templateUrl: './submeasure-edit.component.html',
  styleUrls: ['./submeasure-edit.component.scss']
})
export class SubmeasureEditComponent extends RoutingComponentBase implements OnInit {
  UiUtil = UiUtil;
  editMode = false;
  sm = new Submeasure();
  orgSubmeasure = _.cloneDeep(this.sm);
  measures: Measure[] = [];
  currentMeasure: Measure = new Measure;
  groupingSubmeasures: GroupingSubmeasure[] = [];
  sources: Source[] = [];
  rules: AllocationRule[] = [];
  errs: string[] = [];
  yearmos: { str: string, num: number }[];
  COGS = ' Cogs '; // todo: move to lookup
  disableReportingLevels = [];
  disableCategories = false;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private measureService: MeasureService,
    private sourceService: SourceService,
    private uiUtil: UiUtil
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.yearmos = UiUtil.getFiscalMonthListFromDate(new Date(), 6);
    Promise.all([
      this.measureService.getMany().toPromise(),
      this.ruleService.getManyActive().toPromise(),
      this.sourceService.getMany().toPromise()
    ])
      .then(results => {
        this.measures = _.sortBy(results[0], 'name');
        this.rules = _.sortBy(results[1], 'name').map(rule => ({name: rule.name}));
        this.sources = _.sortBy(results[2], 'name');

        if (this.editMode) {
          this.submeasureService.getOneById(this.route.snapshot.params.id)
            .subscribe(submeasure => {
              this.sm = submeasure;
              this.orgSubmeasure = _.cloneDeep(this.sm);
              this.init();
            });
        } else {
          this.init();
        }
      });
  }

  init() {
    if (this.sm.rules.length === 0) {
      this.sm.rules[0] = '';
    }
    this.syncFilerLevelSwitches();
    this.syncManualMapSwitches();
    this.measureChange();
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
  ]

  isCogsMeasure() {
    return _.find(this.measures, {measureId: this.sm.measureId})
      .name.indexOf(this.COGS) !== -1;
  }

  measureChange() {
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
      })

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
  
  ibe_items = [
    {
      name: 'Internal BE',
      value: 'Internal BE',
    },
    {
      name: 'Internal Sub BE',
      value: 'Internal Sub BE',
    }
  ]
  le_items = [
    {
      name: 'Business Entity',
      value: 'BE',
    }
  ]
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
  ]
  s_items = [
    {
      name: 'Level 1',
      value: 'level1',
    },
    {
      name: 'Level 2',
      value: 'level2',
    },
    {
      name: 'Level 3',
      value: 'level3',
    },
    {
      name: 'Level 4',
      value: 'level4',
    },
    {
      name: 'Level 5',
      value: 'level5',
    },
    {
      name: 'Level 6',
      value: 'level6',
    }
  ]
  scms_items = [
    {
      name: 'SCMS',
      value: 'SCMS',
    }
  ]

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
  ]

  groupings = [
    {
      name: 'Indirect Revenue Adjustments',
      value: 'Indirect Revenue',
    }
  ]

  iflChange(sw) {
    // if Internal Business Entity is selected, make sure Product is unselected
    if (sw === 'ibe' && this.ifl_switch_ibe && this.ifl_switch_p) {
      this.ifl_switch_p = false;
    } else if (sw === 'p' && this.ifl_switch_ibe && this.ifl_switch_p) {
      this.ifl_switch_ibe = false;
    }
  }

  mmChange(sw) {
    // if Internal Business Entity is selected, make sure Product is unselected
    if (sw === 'ibe' && this.mm_switch_ibe && this.mm_switch_p) {
      this.mm_switch_p = false;
    } else if (sw === 'p' && this.mm_switch_ibe && this.mm_switch_p) {
      this.mm_switch_ibe = false;
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

  cleanUpSubmeasure() {
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
            if (this.editMode) {
              this.sm = _.cloneDeep(this.orgSubmeasure);
            } else {
              this.sm = new Submeasure();
            }
            this.init();
          }
        }
      });
  }

  save() {
    this.uiUtil.confirmSave()
      .subscribe(resp => {
        if (resp) {
          {
            this.cleanUpSubmeasure();
            const errs = this.validate();
            if (!errs) {
              let obs: Observable<Submeasure>;
              if (this.editMode) {
                obs = this.submeasureService.update(this.sm);
              } else {
                obs = this.submeasureService.add(this.sm);
              }
              obs.subscribe(submeasure => this.router.navigateByUrl('/prof/submeasure'));
            } else {
              this.uiUtil.genericDialog('Validaton Errors', this.errs.join('\n'));
            }
          }
        }
      });
  }

  validate() {
    this.errs = [];
    const sm = this.sm;
    if (sm.rules.length > _.uniq(sm.rules).length) {
      this.errs.push('Duplicate rules entered');
    }
    return this.errs.length ? this.errs : null;
  }

  ngOnDestroy() {

  }
}

