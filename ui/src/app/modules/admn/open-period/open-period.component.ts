import {Component, OnInit} from '@angular/core';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {UiUtil} from '../../../core/services/ui-util';
import {ToastSeverity} from '../../../core/services/toast.service';
import {DfaModule} from '../../_common/models/module';
import {shUtil} from '../../../../../../shared/misc/shared-util';
import {OpenPeriodService} from '../../_common/services/open-period.service';
import {FiscalMonth} from '../../_common/models/fiscalMonth';
import _ from 'lodash';
import {PgLookupService} from '../../_common/services/pg-lookup.service';
import {OpenPeriod} from '../../_common/models/open-period';

@Component({
  selector: 'fin-open-period',
  templateUrl: './open-period.component.html',
  styleUrls: ['./open-period.component.scss']
})
export class OpenPeriodComponent  extends RoutingComponentBase implements OnInit {

  modules: DfaModule[];
  fiscalMonths: FiscalMonth[] = [];
  openPeriods: OpenPeriod[];
  selFiscalMonths: number[] = [];
  orgSelFiscalMonths: number[];

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private openPeriodService: OpenPeriodService,
    private pgLookupService: PgLookupService,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  ngOnInit() {
   this.modules = this.store.nonAdminModules;
  //  this.fiscalMonths = shUtil.getFiscalMonthListForCurYearAndLast();
  // @ts-ignore
    this.pgLookupService.callRepoMethod('getOpenPeriod', '', '').toPromise().then(results => {
    this.fiscalMonths = results;
 });

    this.refresh();
  }

  refresh() {
    this.openPeriodService.getMany().toPromise()
      .then(openPeriods => {
        this.modules.forEach((module, idx) => {
          this.openPeriods = openPeriods;
          const openPeriod: OpenPeriod = _.find(this.openPeriods, {moduleId: module.moduleId});
          this.selFiscalMonths[idx] = openPeriod ? openPeriod.fiscalMonth : undefined;
          this.orgSelFiscalMonths = _.cloneDeep(this.selFiscalMonths);
        });
      });

  }

  save() {
    const promiseArr: Promise<any>[] = [];
    this.modules.forEach((module, idx) => {
      if (!_.isEqual(this.selFiscalMonths[idx], this.orgSelFiscalMonths[idx])) {
        let openPeriod = _.find(this.openPeriods, {moduleId: module.moduleId});
        if (openPeriod) {
          openPeriod.fiscalMonth = this.selFiscalMonths[idx];
        } else {
          openPeriod = new OpenPeriod(module.moduleId, this.selFiscalMonths[idx]);
        }
        promiseArr.push(this.openPeriodService.upsert(openPeriod).toPromise());
      }
    });

    if (promiseArr.length) {
      Promise.all(promiseArr)
        .then(results => {
          this.refresh();
          this.uiUtil.toast('Module open periods saved.');
        });
    }
  }

}
