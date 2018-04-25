import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RuleService} from '../../../core/services/profitability/rule.service';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {AllocationRule} from '../../../store/models/profitability/allocation-rule';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';
import {RoutingComponentBase} from '../../../shared/routing-component-base';

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  numRules: Number;
  rulesArray: any[];
  rulesCount: Number = 0;
  currentRules: Subscription;
  formControl = new FormControl();
  nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['name', 'period', 'driverName', 'updatedBy', 'updateDate'];
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
      this.formControl.valueChanges.debounceTime(300).subscribe(name => {
        this.nameFilter.next(name);
      });

      this.ruleService.getMany()
        .subscribe(rules => {
        this.rulesCount = rules.length;
        this.rulesArray = rules;
        this.dataSource = new MatTableDataSource(this.rulesArray);
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





