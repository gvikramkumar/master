import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {RuleService} from '../../services/rule.service';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import * as _ from 'lodash';
import {debounceTime} from 'rxjs/operators';
import {UiUtil} from '../../../../core/services/ui-util';
import {shUtil} from '../../../../../../../shared/shared-util';

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
  tableColumns = ['name', 'period', 'driverName', 'status', 'updatedBy', 'updatedDate', 'icons'];
  dataSource: MatTableDataSource<AllocationRule>;
  UiUtil = UiUtil;
  showStatuses: string[];
  filterValue = '';
  sortProperty: string;
  sortDirection: string;
  pageIndex: number;
  pageSize: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ruleService: RuleService,
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
    this.ruleService.getApprovalVersionedListByNameAndUserType()
      .subscribe(rules => {
        this.rules = rules;
        this.changeStatusFilter();
      });
  }

  changeStatusFilter() {
    this.filteredRules = this.rules.filter(rule =>
      _.includes(this.showStatuses, rule.status) );
    this.dataSource = new MatTableDataSource<AllocationRule>(this.filteredRules);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterValue;
    this.paginator.pageIndex = this.pageIndex;
    UiUtil.updateUrl(this.router, this.route, {showStatuses: this.showStatuses.join(',')});
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
              this.changeStatusFilter();
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

}





