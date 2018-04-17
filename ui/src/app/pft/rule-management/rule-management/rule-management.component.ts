import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { RulesService } from '../allocation-rules.service';
import { FormControl } from '@angular/forms';
import { RulesInterface } from '../graphql/schema';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.css']
})
export class RuleManagementComponent implements OnInit {

  public rules: Observable<any[]>;
  public numRules: Number;
  public rulesArray: any[];
  public rulesCount: Number = 0;
  public currentRules: Subscription;
  public formControl = new FormControl();
  private nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['RULE_NAME', 'PERIOD', 'DRIVER_NAME', 'UPDATED_BY', 'UPDATE_DATE'];
  dataSource: MatTableDataSource<RuleData>;

  constructor(private _ruleService: RulesService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
      this.rules = this._ruleService.get();
      this.formControl.valueChanges.debounceTime(300).subscribe(name => {
        this.nameFilter.next(name);
      });

      this.rules.subscribe((_rules: any[]) => {

        //debugging
        console.log("first rule's name: " + _rules[0].RULE_NAME);
        console.log("second rule's name: " + _rules[1].RULE_NAME);

        this.rulesCount = _rules.length;
        console.log("count is: " + this.rulesCount); //debugging
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

export interface RuleData {
  //id: string | null;
  RULE_NAME: string;
  PERIOD: string;
  DRIVER_NAME: string;
  SALES_MATCH: string;
  PRODUCT_MATCH: string;
  SCMS_MATCH: string;
  LEGAL_ENTITY_MATCH: string;
  BE_MATCH: string;
  SL1_SELECT: string;
  SCMS_SELECT: string;
  BE_SELECT: string;
  CREATED_BY: string;
  CREATE_DATE: string;
  UPDATED_BY: string;
  UPDATE_DATE: string;
}

