import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subject} from 'rxjs';
import {SubmeasureService} from '../../services/submeasure.service';
import {Submeasure} from '../../models/submeasure';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {Measure} from '../../models/measure';
import {MeasureService} from '../../services/measure.service';
import * as _ from 'lodash';
import {Source} from '../../../../../../../shared/models/source';
import {SourceService} from '../../services/source.service';
import {UiUtil} from '../../../../core/services/ui-util';

@Component({
  selector: 'fin-submeasure',
  templateUrl: './submeasure.component.html',
  styleUrls: ['./submeasure.component.scss']
})
export class SubmeasureComponent extends RoutingComponentBase implements OnInit {
  tableColumns = ['name', 'sourceId', 'processingTime', 'startFiscalMonth', 'status', 'updatedBy', 'updatedDate'];
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue = '';
  UiUtil = UiUtil;

  constructor(
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private route: ActivatedRoute,
    private measureService: MeasureService,
    private sourceService: SourceService
  ) {
    super(store, route);
  }

  ngOnInit() {

    Promise.all([
      this.measureService.getMany().toPromise(),
      this.submeasureService.getMany().toPromise(),
      this.sourceService.getMany().toPromise()
    ])
      .then(results => {
        this.measures = _.sortBy(results[0], 'name');
        this.submeasures = _.sortBy(results[1], 'name');
        this.sources = results[2];
        this.measureId = this.measures[0].measureId;
        this.changeFilter();
      });
  }

  getSourceName(sourceId) {
    // todo: REMOVE THIS IF BEFORE CHECK IN
    if (sourceId > 0 && sourceId <= 4) {
      return _.find(this.sources, {sourceId: sourceId}).name;
    }
  }

  changeFilter() {
    this.filteredSubmeasures = this.submeasures.filter(sm => {
      return sm.measureId = this.measureId && _.includes(this.showStatuses, sm.status);
    });

    this.dataSource = new MatTableDataSource<Submeasure>(this.filteredSubmeasures);
    this.filterValue = '';
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
