import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { SubmeasureInterface } from '../graphql/schema';
import { SubmeasureService } from '../allocation-submeasure.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'fin-submeasure',
  templateUrl: './submeasure.component.html',
  styleUrls: ['./submeasure.component.scss']
})
export class SubmeasureComponent implements OnInit {

  public _opened: boolean = true;
  public _mode: string = 'push';
  public submeasures: Observable<any[]>;
  public numRules: Number;
  public submeasuresArray: any[];
  public submeasuresCount: Number = 0;
  //public currentSubmeasure: Subscription;
  public formControl = new FormControl();
  private nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['SUB_MEASURE_KEY', 'SUB_MEASURE_NAME'];
  dataSource: MatTableDataSource<SubmeasureData>;

  //@Output() private changeTestEmitter: EventEmitter<MatRadioChange>;

  //for radio button list in sidebar:
  selectedRadio: string;
  //todo: these need to have role-based access (likely stored in Mongo)
  radios = [
    'Indirect Revenue Adjustments',
    'Manufacturing Overhead',
    'Manufacturing Supply Chain Expenses',
    'Manufacturing V&O',
    'Standard COGS Adjustments',
    'Warranty'
  ];

  constructor(private _submeasureService: SubmeasureService) { }


  changeMeasure() {
    //Runs whenever new radio button is selected (new measure selected)
    console.log("current value: " + this.selectedRadio);
  }

  onSearchTextUpdated() {
    //Runs when new search query.
    //todo: input validation for search queries
    console.log("Search field updated");
  }


  //
  //
  // -----------table testing:
  // todo: add column for radio button select
  // Temporary hardcoded columns:
  // columns = [
  //   { columnDef: 'userId',    header: 'ID',       cell: (row: UserData) => `${row.id}`        },
  //   { columnDef: 'userName',  header: 'Name',     cell: (row: UserData) => `${row.name}`      },
  //   { columnDef: 'progress',  header: 'Progress', cell: (row: UserData) => `${row.progress}%` }
  // ];
  //displayedColumns = this.columns.map(x => x.columnDef);

  //exampleDatabase = new ExampleDatabase();
  //dataSource: ExampleDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    //this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator);
    this.submeasures = this._submeasureService.get();
    this.formControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });

    this.submeasures.subscribe((_submeasures: any[]) => {

      //debugging
      console.log("first rule's name: " + _submeasures[0].SUB_MEASURE_KEY);
      console.log("second rule's name: " + _submeasures[1].SUB_MEASURE_NAME);

      this.submeasuresCount = _submeasures.length;
      console.log("count is: " + this.submeasuresCount); //debugging
      this.submeasuresArray = _submeasures;
      this.dataSource = new MatTableDataSource(this.submeasuresArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

  });
  }

}



//
//
//------------------------for table example:
//
/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['GLOBAL CHANNEL PROGRAMS', 'MDS BUFFER DIRECT', 'BU CREDIT MEMOS', 'MISC EO DIRECT', 'DIRECT DF BULK', 'HYBRID CHANNEL PROGRAMS',
'SIGNIFICANT DEALS', 'INDIRECT BUYDOWN PROVISION_FY07', 'ADVANCE PURCHASE INDIRECT', 'DIRECT DF BULK', 'CA CE ASS GL ADJUSTMENT SL6', 'REMARKETING EXPENSES REFURBISHED DIRECT',
'2TIER RMA', 'ADVANCE PURCHASE INDIRECT', 'LOAN RESERVE CORP GL', 'NEWBUYS COGS- ADJ MANUAL ADJUSTMENT', 'CMS LMY NON TYPE 5 REVENUE OFFSET', 'OTHER SUPPLY CHAIN DIRECT', 'DIRECT REVAL_FY07'];

export interface UserData {
id: string;
name: string;
progress: string;
color: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
/** Stream that emits whenever the data has been modified. */
dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
get data(): UserData[] { return this.dataChange.value; }

constructor() {
  // Fill up the database with 100 users.
  for (let i = 0; i < 100; i++) { this.addUser(); }
}

/** Adds a new user to the database. */
addUser() {
  const copiedData = this.data.slice();
  copiedData.push(this.createNewUser());
  this.dataChange.next(copiedData);
}

/** Builds and returns a new User. */
private createNewUser() {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: (this.data.length + 1).toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
}

/**
* Data source to provide what data should be rendered in the table. Note that the data source
* can retrieve its data in any way. In this case, the data source is provided a reference
* to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
* the underlying data. Instead, it only needs to take the data and send the table exactly what
* should be rendered.
*/
export class ExampleDataSource extends DataSource<any> {
constructor(private _exampleDatabase: ExampleDatabase, private _paginator: MatPaginator) {
  super();
}

/** Connect function called by the table to retrieve one stream containing the data to render. */
connect(): Observable<UserData[]> {
  const displayDataChanges = [
    this._exampleDatabase.dataChange,
    this._paginator.page,
  ];

  return Observable.merge(...displayDataChanges).map(() => {
    const data = this._exampleDatabase.data.slice();

    // Grab the page's slice of data.
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.splice(startIndex, this._paginator.pageSize);
  });
}

disconnect() {}
}

export interface SubmeasureData {
  //id: string | null;
  SUB_MEASURE_KEY: number;
  SUB_MEASURE_NAME: string;
}
