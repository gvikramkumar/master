import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {RuleService} from '../../services/rule.service';
import {FormControl} from '@angular/forms';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import _ from 'lodash';
import {UiUtil} from '../../../../core/services/ui-util';
import {shUtil} from '../../../../../../../shared/misc/shared-util';
import {DialogSize, DialogType} from '../../../../core/models/ui-enums';
import {ruleUtil} from '../../../../../../../shared/misc/rule-util';
import {SubmeasureService} from '../../services/submeasure.service';
import {Submeasure} from '../../../../../../../shared/models/submeasure';

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  rules: AllocationRule[] = [];
  filteredRules: AllocationRule[] = [];
  rulesCount: Number = 0;
  formControl = new FormControl();
  tableColumns = ['name', 'period', 'driverName', 'inUse', 'status', 'updatedBy', 'updatedDate', 'icons'];
  dataSource: MatTableDataSource<AllocationRule>;
  UiUtil = UiUtil;
  showStatuses: string[];
  filterValue = '';
  sortProperty: string;
  sortDirection: string;
  pageIndex: number;
  pageSize: number;
  submeasuresAll: Submeasure[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private store: AppStore,
    public route: ActivatedRoute,
    private uiUtil: UiUtil,
    private router: Router
  ) {
    super(store, route);
    this.sortProperty = this.route.snapshot.queryParams.sortProperty || 'updatedDate';
    this.sortDirection = this.route.snapshot.queryParams.sortDirection || 'desc';
    this.pageIndex = this.route.snapshot.queryParams.pageIndex || 0;
    this.pageSize = this.route.snapshot.queryParams.pageSize || 25;
    this.filterValue = this.route.snapshot.queryParams.filterValue || '';
    const qsShowStatuses = shUtil.stringToArray(this.route.snapshot.queryParams.showStatuses);
    this.showStatuses = qsShowStatuses.length ? qsShowStatuses : ['A', 'I', 'P', 'D'];
  }

  ngOnInit() {
    this.store.mainCompDataLoad = true;
    Promise.all([
      this.ruleService.getApprovalVersionedListByNameAndUserType().toPromise(),
      this.submeasureService.getManyLatestGroupByNameActive().toPromise()
    ]).then(results => {
      this.store.mainCompDataLoad = false;
      this.rules = results[0];
      this.submeasuresAll = results[1];
      this.refresh();
    }).catch(() => this.store.mainCompDataLoad = false);
  }

  refresh() {
    this.filteredRules = this.rules.filter(rule =>
      _.includes(this.showStatuses, rule.status));

    this.filteredRules.forEach(rule => {
      rule['usingSubmeasuresNamesTooltip'] = 'Rule is in use by the following submeasures: \n';
      const submeasuresInUse: string[] = [];
      this.submeasuresAll.forEach(sm => {
        if (_.includes(sm.rules, rule.name)) {
          submeasuresInUse.push(sm.name);
        }
      });
      rule['inUse'] = submeasuresInUse.length || '';
      rule['usingSubmeasuresNamesTooltip'] += submeasuresInUse.join('\n');
    });

    this.dataSource = new MatTableDataSource<AllocationRule>(this.filteredRules);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterValue;
    this.paginator.pageIndex = this.pageIndex;
  }

  changeStatusFilter() {
    UiUtil.updateUrl(this.router, this.route, {showStatuses: this.showStatuses.join(',')});
    this.refresh();
  }

  applyFilter(_filterValue: string) {
    const filterValue = _filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.pageIndex = 0;
    UiUtil.updateUrl(this.router, this.route, {pageIndex: this.pageIndex, filterValue});
  }

  remove(rule) {
    this.uiUtil.confirmDelete()
      .subscribe(resp => {
        if (resp) {
          this.ruleService.remove(rule.id)
            .subscribe(() => {
              this.rules.splice(this.rules.indexOf(rule), 1);
              this.refresh();
              this.uiUtil.toast('Rule deleted.');
            });
        }
      });
  }

  showDeleteIcon(rule) {
    return _.includes(['D', 'P'], rule.status);
  }

  sortChange(sort: Sort) {
    UiUtil.updateUrl(this.router, this.route, {sortProperty: sort.active, sortDirection: sort.direction});
  }


  pageChange(page: PageEvent) {
    UiUtil.updateUrl(this.router, this.route, {pageIndex: page.pageIndex, pageSize: page.pageSize});
  }

  canEdit(sm) {
    return this.store.user.isModuleAdminOrGreater() || (this.store.user.isModuleSuperUser() && (sm.status === 'D' || sm.status === 'P'));
  }

  showDescription(rule) {
    this.uiUtil.genericDialog(null, ruleUtil.getRuleDescription(rule), null, DialogType.ok, DialogSize.large, false);
  }

}





