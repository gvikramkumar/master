import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {AppStore} from "../../../app/app-store";
import {ActivatedRoute} from "@angular/router";
import {RoutingComponentBase} from "../../../core/base-classes/routing-component-base";
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SourceService} from '../../_common/services/source.service';
import {Source} from '../../_common/models/source';
import {CuiTableOptions} from "@cisco-ngx/cui-components";

@Component({
  selector: 'fin-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent extends RoutingComponentBase implements OnInit {

  sources: Source[] = [];
  sourceName: string;
  sourceDesc: string;
  sourceStatus: string;
  sourceStatusBool: boolean;
  showAdd: boolean = false;
  showEdit: boolean = false;
  showForm: boolean = false;
  tableColumns = ['name', 'desc', 'status'];
  dataSource: MatTableDataSource<Source>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterValue = '';

  constructor(
    private store: AppStore,
    private route: ActivatedRoute,
    private sourceService: SourceService
  ) {
    super(store, route);

  }

  ngOnInit() {
    /*this.dataSource = new MatTableDataSource<Source>(this.sources);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/

    Promise.all([
      this.sourceService.getMany().toPromise()
    ])
      .then(results => {
        this.sources = results[0];
        this.dataSource = new MatTableDataSource<Source>(this.sources);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addSource() {
    this.sourceName = '';
    this.sourceDesc = '';
    this.sourceStatus = 'I';
    this.sourceStatusBool = false;
    this.showEdit = false;
    this.showAdd = true;
    this.showForm = true;
  }

  editSource(i) {
    var source = this.getSourceById(i);
    this.sourceName = source.name;
    this.sourceDesc = source.description;
    this.sourceStatus = source.status;
    if(this.sourceStatus == 'A') {
      this.sourceStatusBool = true;
    }
    else {
      this.sourceStatusBool = false;
    }
    this.showAdd = false;
    this.showEdit = true;
    this.showForm = true;
  }

  getSourceById(id) {
    for (var i = 0; i < this.sources.length; i++) {
      if (this.sources[i]['id'] === id) {
        return this.sources[i];
      }
    }
    return null;
  }

}
