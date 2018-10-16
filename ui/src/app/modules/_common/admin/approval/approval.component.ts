import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {debounceTime} from 'rxjs/operators';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {Measure} from '../../models/measure';
import {MeasureService} from '../../services/measure.service';
import {AppStore} from '../../../../app/app-store';
import {UiUtil} from '../../../../core/services/ui-util';

@Component({
  selector: 'fin-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  measures: Measure[];
  measuresCount: Number = 0;
  formControl = new FormControl();
  nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['name', 'typeCode', 'status', 'updatedBy', 'updatedDate'];
  dataSource: MatTableDataSource<Measure>;
  UiUtil = UiUtil;

  constructor(
    private measureService: MeasureService,
    private store: AppStore,
    private route: ActivatedRoute
  ) {
    super(store, route);

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.formControl.valueChanges.pipe(debounceTime(300))
      .subscribe(name => {
        this.nameFilter.next(name);
      });

    this.measureService.getManyLatest('name')
      .subscribe(measures => {
        this.measures = _.orderBy(measures, ['updatedDate'], ['desc']);
        this.measuresCount = measures.length;
        this.dataSource = new MatTableDataSource(this.measures);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}





