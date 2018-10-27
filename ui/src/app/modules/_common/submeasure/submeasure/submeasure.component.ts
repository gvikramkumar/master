import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {Subject} from 'rxjs';
import {SubmeasureService} from '../../services/submeasure.service';
import {Submeasure} from '../../models/submeasure';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {Measure} from '../../models/measure';
import {MeasureService} from '../../services/measure.service';
import * as _ from 'lodash';
import {Source} from '../../../../../../../shared/models/source';
import {SourceService} from '../../services/source.service';
import {UiUtil} from '../../../../core/services/ui-util';
import * as moment from 'moment';
import AnyObj from '../../../../../../../shared/models/any-obj';

@Component({
  selector: 'fin-submeasure',
  templateUrl: './submeasure.component.html',
  styleUrls: ['./submeasure.component.scss']
})
export class SubmeasureComponent extends RoutingComponentBase implements OnInit {
  tableColumns = ['name', 'sourceId', 'processingTime', 'startFiscalMonth', 'status', 'updatedBy', 'updatedDate', 'icons'];
  dataSource: MatTableDataSource<Submeasure>;
  measureId: number;
  measures: Measure[] = [];
  sources: Source[] = [];
  statuses = [
    {name: 'Active', value: 'A'},
    {name: 'Inactive', value: 'I'},
    {name: 'Pending', value: 'P'},
    {name: 'Draft', value: 'D'}];
  showStatuses = ['A', 'I', 'P', 'D'];
  submeasures: Submeasure[] = [];
  filteredSubmeasures: Submeasure[] = [];
  filterValue = '';
  UiUtil = UiUtil;
  moment = moment;
  sortProperty: string;
  sortDirection: string;
  pageIndex: number;
  pageSize: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private route: ActivatedRoute,
    private measureService: MeasureService,
    private sourceService: SourceService,
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

    Promise.all([
      this.measureService.getMany().toPromise(),
      this.submeasureService.getApprovalVersionedListByNameAndUserType().toPromise(),
      this.sourceService.getMany().toPromise()
    ])
      .then(results => {
        this.measures = _.sortBy(results[0], 'name');
        this.submeasures = _.orderBy(results[1], ['updatedDate'], ['desc']);
        this.sources = results[2];
        this.measureId = this.measures[0].measureId;
        this.changeStatusFilter(true);
      });
  }

  getSourceName(sourceId) {
    // todo: REMOVE THIS IF BEFORE CHECK IN
    if (sourceId > 0 && sourceId <= 4) {
      return (<AnyObj>_.find(this.sources, {sourceId: sourceId})).name;
    }
  }

  changeStatusFilter(init = false) {
    this.filteredSubmeasures = this.submeasures.filter(sm => {
      return sm.measureId === this.measureId && _.includes(this.showStatuses, sm.status);
    });

    this.dataSource = new MatTableDataSource<Submeasure>(this.filteredSubmeasures);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (init && this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    }
    this.paginator.pageIndex = this.pageIndex;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.pageIndex = 0;
    this.router.navigate([], {relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {pageIndex: this.pageIndex, filterValue}});
  }

  remove(submeasure) {
    this.uiUtil.confirmDelete()
      .subscribe(resp => {
        if (resp) {
          this.submeasureService.remove(submeasure.id)
            .subscribe(() => {
              this.submeasures.splice(this.submeasures.indexOf(submeasure), 1);
              this.changeStatusFilter();
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
