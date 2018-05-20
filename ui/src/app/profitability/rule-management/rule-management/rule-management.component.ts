import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RuleService} from '../../services/rule.service';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {AllocationRule} from '../../store/models/allocation-rule';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import * as _ from 'lodash';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  rules: AllocationRule[];
  rulesCount: Number = 0;
  formControl = new FormControl();
  nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['name', 'period', 'driverName', 'updatedBy', 'updatedDate'];
  dataSource: MatTableDataSource<AllocationRule>;

  constructor(
    private ruleService: RuleService,
    private store: Store,
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

    this.ruleService.getManyLatest()
      .subscribe(rules => {
        this.rules = _.orderBy(rules, ['updatedDate'], ['desc']);
        this.rulesCount = rules.length;
        this.dataSource = new MatTableDataSource(this.rules);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}





