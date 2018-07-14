import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Submeasure} from '../../models/submeasure';
import {AppStore} from '../../../../app/app-store';
import {RuleService} from '../../services/rule.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {AllocationRule} from '../../models/allocation-rule';
import {forkJoin, Observable, of} from 'rxjs/index';
import {MeasureService} from '../../services/measure.service';
import {Measure} from '../../models/measure';
import {uiConst} from '../../../../core/models/ui-const';
import * as _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {filter} from 'rxjs/operators';
import {SourceService} from '../../services/source.service';
import {Source} from '../../models/source';

@Component({
  selector: 'fin-submeasure-add',
  templateUrl: './submeasure-edit.component.html',
  styleUrls: ['./submeasure-edit.component.scss']
})
export class SubmeasureEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  title: string;
  sm = new Submeasure();
  orgSubmeasure = _.cloneDeep(this.sm);
  measures: Measure[] = [];
  sources: Source[] = [];
  rules: AllocationRule[];
  errs: string[] = [];
  yearmos: { str: string, num: number }[];
  COGS = ' Cogs '; // todo: move to lookup
  showCategories = false;
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
    private sourceService: SourceService
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  get swManualMapping() {
    return this.sm.indicators.manualMapping === 'Y';
  }
  set swManualMapping(val) {
    this.sm.indicators.manualMapping = val ? 'Y' : 'N';
  }

  ngOnInit() {
    this.yearmos = UiUtil.getFiscalMonthListFromDate(new Date(), 6);
    Promise.all([
      this.measureService.getMany().toPromise(),
      this.ruleService.getMany().toPromise(),
      this.sourceService.getMany().toPromise(),
    ])
      .then(results => {
        this.measures = _.sortBy(results[0], name);
        this.rules = _.sortBy(results[1], name);
        this.sources = _.sortBy(results[2], name);

        if (this.editMode) {
          this.title = 'Edit Submeasure';
          this.submeasureService.getOneById(this.route.snapshot.params.id)
            .subscribe(submeasure => {
              this.sm = submeasure;
              this.orgSubmeasure = _.cloneDeep(this.sm);
              this.init();
            });
        } else {
          this.title = 'Create Submeasure';
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
    this.measureNameChange();
    if (!this.isCogsMeasure()) {
      this.sm.categoryType = 'HW';
    }
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
    const measure = _.find(this.measures, {measureId: this.sm.measureId});
    return measure ? measure.name.indexOf(this.COGS) !== -1 : false;
  }

  measureNameChange() {
    this.showCategories = this.isCogsMeasure() ? true : false;
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
    if (!this.swManualMapping || !this.mm_switch_ibe) {
      delete this.sm.manualMapping.internalBELevel;
    }
    if (!this.swManualMapping || !this.mm_switch_p) {
      delete this.sm.manualMapping.productLevel;
    }
    if (!this.swManualMapping || !this.mm_switch_le) {
      delete this.sm.manualMapping.entityLevel;
    }
    if (!this.swManualMapping || !this.mm_switch_s) {
      delete this.sm.manualMapping.salesLevel;
    }
    if (!this.swManualMapping || !this.mm_switch_scms) {
      delete this.sm.manualMapping.scmsLevel;
    }
  }

  cleanUpSubmeasure() {
    this.cleanIflSwitchChoices();
    this.cleanMMSwitchChoices();
    this.sm.rules = this.sm.rules.filter(r => !!r);

    if (!this.isCogsMeasure()) {
      this.sm.categoryType = 'HW';
    }
  }

  hasChanges() {
    return !_.isEqual(this.sm, this.orgSubmeasure);
  }


  verifyLosingChanges() {
    if (this.hasChanges()) {
      alert('Are you sure you want to lose your changes?');
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  cancel() {
    this.verifyLosingChanges()
      .then(() => this.router.navigateByUrl('/prof/submeasure'));
  }

  reset() {
    this.verifyLosingChanges()
      .then(() => {
        if (this.editMode) {
          this.sm = _.cloneDeep(this.orgSubmeasure);
        } else {
          this.sm = new Submeasure();
        }
        this.init();
      });
  }

  confirmSave() {
    alert('Are you sure you want to save?');
    return Promise.resolve();
  }

  save() {
    this.confirmSave()
      .then(() => {
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
          alert(this.errs.join('\n'));
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

