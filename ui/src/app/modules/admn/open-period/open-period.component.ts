import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {RuleService} from '../../_common/services/rule.service';
import {SourceService} from '../../_common/services/source.service';
import {UiUtil} from '../../../core/services/ui-util';
import {ToastService, ToastSeverity} from '../../../core/services/toast.service';
import {DfaModule} from '../../_common/models/module';
import {Source} from '../../_common/models/source';
import {ModuleLookupService} from '../../_common/services/module-lookup.service';
import {shUtil} from '../../../../../../shared/shared-util';
import {OpenPeriodService} from '../../_common/services/open-period.service';
import {FiscalMonth} from '../../_common/models/fiscalMonth';
import * as _ from 'lodash';
import {PgLookupService} from '../../_common/services/pg-lookup.service';
import {OpenPeriod} from '../../_common/models/open-period';

@Component({
  selector: 'fin-open-period',
  templateUrl: './open-period.component.html',
  styleUrls: ['./open-period.component.scss']
})
export class OpenPeriodComponent  extends RoutingComponentBase {

  modules: DfaModule[];
  fiscalMonths: FiscalMonth[][] = [];
  openPeriods: OpenPeriod[];
  selFiscalMonths: number[] = [];
  orgSelFiscalMonths: number[];

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private openPeriodService: OpenPeriodService,
    private pgLookupService: PgLookupService,
    private toastService: ToastService,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.modules = this.store.nonAdminModules;
    Promise.all([
      this.pgLookupService.getFiscalMonths().toPromise(),
      this.openPeriodService.getMany().toPromise()
    ])
      .then(results => {
        this.modules.forEach((module, idx) => {
          this.fiscalMonths.push(_.cloneDeep(results[0]));
          this.openPeriods = results[1];
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
        promiseArr.push(this.openPeriodService.upsertQueryOne({moduleId: module.moduleId},
          openPeriod).toPromise());
      }
    });

    Promise.all(promiseArr)
      .then(results => {
        this.toastService.showAutoHideToast('Submitted',
          'Module open periods have been submitted successfully.', ToastSeverity.success);
      });
  }

}
