import {Component, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'fin-submeasure',
  templateUrl: './submeasure.component.html',
  styleUrls: ['./submeasure.component.scss']
})
export class SubmeasureComponent extends RoutingComponentBase implements OnInit {
  tableColumns = ['key', 'name'];
  dataSource: MatTableDataSource<Submeasure>;
  selectedMeasure: Measure;
  measures: Measure[];
  submeasures: Submeasure[] = [];
  filteredSubmeasures: Submeasure[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterValue = '';

  constructor(
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private route: ActivatedRoute,
    private measureService: MeasureService
  ) {
    super(store, route);
  }

  ngOnInit() {

    Promise.all([
      this.measureService.getMany().toPromise(),
      this.submeasureService.getMany().toPromise()
    ])
      .then(results => {
        this.measures = _.sortBy(results[0], name);
        this.submeasures = _.sortBy(results[1], 'name');
        this.selectedMeasure = this.measures[0];
        this.changeMeasure();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  changeMeasure() {
    this.filteredSubmeasures = _.filter(this.submeasures, {measureName: this.selectedMeasure.name})
    this.dataSource = new MatTableDataSource<Submeasure>(this.filteredSubmeasures);
    this.filterValue = '';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
