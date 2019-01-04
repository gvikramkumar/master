import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Submeasure} from '../../../../../../../shared/models/submeasure';
import {MeasureService} from '../../services/measure.service';
import {SourceService} from '../../services/source.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {RuleService} from '../../services/rule.service';
import {AppStore} from '../../../../app/app-store';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import * as _ from 'lodash';
import {shUtil} from '../../../../../../../shared/shared-util';

@Component({
  selector: 'fin-submeasure-detail-dialog',
  templateUrl: './submeasure-detail-dialog.component.html',
  styleUrls: ['./submeasure-detail-dialog.component.scss']
})
export class SubmeasureDetailDialogComponent {
  sm: Submeasure;
  measureName: string;
  sourceName: string;
  groupingSubmeasureName: string;
  rules: AllocationRule[] = [];
  rulesAll: AllocationRule[];
  shUtil = shUtil;

  constructor(
    public dialogRef: MatDialogRef<SubmeasureDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private measureService: MeasureService,
    private sourceService: SourceService,
    private submeasureService: SubmeasureService,
    private ruleService: RuleService,
    private store: AppStore
  ) {
    this.sm = data;
  }

  ngOnInit() {
    const promises: Promise<any>[] = [
      this.measureService.getQueryOne({measureId: this.sm.measureId}).toPromise(),
      this.sourceService.getQueryOne({sourceId: this.sm.sourceId}).toPromise(),
      this.ruleService.getManyLatestGroupByNameActive(this.store.module.moduleId).toPromise()
    ];
    if (this.sm.groupingSubmeasureId) {
      promises.push(this.submeasureService.getOneLatest({submeasureKey: this.sm.groupingSubmeasureId, status: {$in: ['A', 'I']}}).toPromise());
    }
    Promise.all(promises)
      .then(results => {
        this.measureName = results[0].name;
        this.sourceName = results[1].name;
        this.rulesAll = results[2];
        this.sm.rules.forEach(name => this.rules.push(_.find(this.rulesAll, {name})));
        if (this.sm.groupingSubmeasureId) {
          this.groupingSubmeasureName = results[3].name;
        }
      });
  }

  hasFlashCategory() {
    // Manufacturing V&O and MRAP
    return this.sm.measureId === 3 && this.sm.sourceId === 2;
  }

  hasAdjustmentType() {
    // Indirect Revenue Adjustments AND RRR
    return this.sm.measureId === 1 && this.sm.sourceId === 1;
  }

}

