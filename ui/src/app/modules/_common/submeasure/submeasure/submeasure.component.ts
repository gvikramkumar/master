import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {BehaviorSubject, Observable, Subject, merge} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {SubmeasureService} from '../../services/submeasure.service';
import {Submeasure} from '../../models/submeasure';
import {RoutingComponentBase} from '../../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../../../../app/app-store';

@Component({
  selector: 'fin-submeasure',
  templateUrl: './submeasure.component.html',
  styleUrls: ['./submeasure.component.scss']
})
export class SubmeasureComponent extends RoutingComponentBase implements OnInit {

  public _opened: boolean = true;
  public _mode: string = 'push';
  public submeasuresCount: Number = 0;
  //public currentSubmeasure: Subscription;
  public formControl = new FormControl();
  private nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['key', 'name'];
  dataSource: MatTableDataSource<Submeasure>;

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

  constructor(
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private route: ActivatedRoute
  ) {
    super(store, route);
  }


  changeMeasure() {
    //Runs whenever new radio button is selected (new measure selected)
  }

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
    this.formControl.valueChanges.pipe(debounceTime(300))
      .subscribe(name => {
      this.nameFilter.next(name);
    });

    this.submeasureService.getMany()
      .subscribe(submeasures => {
        this.submeasuresCount = submeasures.length;
        this.dataSource = new MatTableDataSource<Submeasure>(submeasures);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
