import {Component, OnInit, ViewChild} from '@angular/core';
import {AppStore} from "../../../app/app-store";
import {ActivatedRoute} from "@angular/router";
import {RoutingComponentBase} from "../../../core/base-classes/routing-component-base";
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LookupService} from '../../_common/services/lookup.service';

@Component({
  selector: 'fin-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent extends RoutingComponentBase implements OnInit {

  tableColumns = ['name', 'code', 'active'];
  dataSource: MatTableDataSource<Source>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //sources: Source[] = []; //blank Source array to be filled in ngOnInit

  //SOURCE DUMMY DATA:
  sources: Source[] = [
    {
      id: 1,
      name: "Source1",
      code: "src1",
      active: "A"
    },
    {
      id: 2,
      name: "Source2",
      code: "src2",
      active: "I"
    }
  ];

  filterValue = '';

  constructor(
    private store: AppStore,
    private route: ActivatedRoute
  ) {
    super(store, route);

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Source>(this.sources);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

class Source {
  id: number;
  name: string;
  code: string;
  active: string;
}
