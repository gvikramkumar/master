import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {SubmeasureService} from '../../services/submeasure.service';
import {Submeasure} from '../../../../../../../shared/models/submeasure';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {Measure} from '../../models/measure';
import {MeasureService} from '../../services/measure.service';
import _ from 'lodash';
import {Source} from '../../../../../../../shared/models/source';
import {SourceService} from '../../services/source.service';
import {UiUtil} from '../../../../core/services/ui-util';
import moment from 'moment';
import {shUtil} from '../../../../../../../shared/misc/shared-util';

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
  showStatuses: string[];
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
        this.measureService.getManyActive().toPromise(),
        this.submeasureService.getApprovalVersionedListByNameAndUserType().toPromise(),
        this.sourceService.getMany().toPromise()
      ])
        .then(results => {
          this.measures = _.sortBy(results[0], 'name');
          this.submeasures = results[1];
          this.sources = results[2];
          const routeMeasure = this.route.snapshot.queryParams.measureId && Number(this.route.snapshot.queryParams.measureId);
          if (routeMeasure) {
            this.measureId = routeMeasure;
          } else {
            this.measureId = this.measures[0].measureId;
            UiUtil.updateUrl(this.router, this.route, {measureId: this.measureId});
          }
          this.refresh();
        })
        .then(() => this.store.mainCompDataLoad = false)
        .catch(() => this.store.mainCompDataLoad = false);


  }

  getSourceName(sourceId) {
    const source = _.find(this.sources, {sourceId: sourceId});
    return source && source.name || sourceId;
  }

  measureChange() {
    this.refresh();
    UiUtil.updateUrl(this.router, this.route, {measureId: this.measureId});
  }

  changeStatusFilter() {
    UiUtil.updateUrl(this.router, this.route, {showStatuses: this.showStatuses.join(',')});
    this.refresh();
  }

  refresh() {
    this.filteredSubmeasures = this.submeasures.filter(sm => {
      return sm.measureId === this.measureId && _.includes(this.showStatuses, sm.status);
    });

    this.dataSource = new MatTableDataSource<Submeasure>(this.filteredSubmeasures);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterValue;
    this.paginator.pageIndex = this.pageIndex;
  }

  applyFilter(_filterValue: string) {
    const filterValue = _filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.pageIndex = 0;
    UiUtil.updateUrl(this.router, this.route, {pageIndex: this.pageIndex, filterValue});
  }

  remove(submeasure) {
    this.uiUtil.confirmDelete()
      .subscribe(resp => {
        if (resp) {
          this.submeasureService.remove(submeasure.id)
            .subscribe(() => {
              this.submeasures.splice(this.submeasures.indexOf(submeasure), 1);
              this.refresh();
            });
        }
      });
  }

  showDeleteIcon(sm) {
    return _.includes(['D', 'P'], sm.status) && (this.store.user.isItAdmin() || this.store.user.id === sm.updatedBy);
  }

  sortChange(sort: Sort) {
    UiUtil.updateUrl(this.router, this.route, {sortProperty: sort.active, sortDirection: sort.direction});
  }

  pageChange(page: PageEvent) {
    UiUtil.updateUrl(this.router, this.route, {pageIndex: page.pageIndex, pageSize: page.pageSize});
  }

}
