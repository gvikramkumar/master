import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RuleService} from '../../../core/services/pft/rule.service';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {AllocationRule} from '../../store/models/allocation-rule';

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent implements OnInit {

  public numRules: Number;
  public rulesArray: any[];
  public rulesCount: Number = 0;
  public currentRules: Subscription;
  public formControl = new FormControl();
  private nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['name', 'period', 'driverName', 'updatedBy', 'updateDate'];
  dataSource: MatTableDataSource<AllocationRule>;

  constructor(private _ruleService: RuleService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
      this.formControl.valueChanges.debounceTime(300).subscribe(name => {
        this.nameFilter.next(name);
      });

      this._ruleService.getAll()
        .subscribe((_rules: any[]) => {
        this.rulesCount = _rules.length;
        this.rulesArray = _rules;
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





