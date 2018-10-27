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

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  rules: AllocationRule[] = [];
  rulesCount: Number = 0;
  formControl = new FormControl();
  tableColumns = ['name', 'period', 'driverName', 'status', 'updatedBy', 'updatedDate', 'icons'];
  dataSource: MatTableDataSource<AllocationRule>;
  UiUtil = UiUtil;
  statuses = [
    {name: 'Active', value: 'A'},
    {name: 'Inactive', value: 'I'},
    {name: 'Pending', value: 'P'},
    {name: 'Draft', value: 'D'}];
  showStatuses = ['A', 'I', 'P', 'D'];
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

    this.sortProperty = this.route.snapshot.queryParams.sortProperty;
    this.sortDirection = this.route.snapshot.queryParams.sortDirection;
    this.pageIndex = this.route.snapshot.queryParams.pageIndex;
    this.pageSize = this.route.snapshot.queryParams.pageSize;
    this.filterValue = this.route.snapshot.queryParams.filterValue;
  }

  ngOnInit() {
    this.ruleService.getApprovalVersionedListByNameAndUserType()
      .subscribe(rules => {
        this.rules = _.orderBy(rules, ['updatedDate'], ['desc']);
        this.refresh();
      });
  }

  refresh() {
    this.dataSource = new MatTableDataSource<AllocationRule>(this.rules);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterValue;
    this.paginator.pageIndex = this.pageIndex;
  }

  applyFilter(_filterValue: string) {
    const filterValue = _filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.pageIndex = 0;
    this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {pageIndex: this.pageIndex, filterValue}});
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
    this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {sortProperty: sort.active, sortDirection: sort.direction}});
  }

  pageChange(page: PageEvent) {
    this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {pageIndex: page.pageIndex, pageSize: page.pageSize}});
  }

}





