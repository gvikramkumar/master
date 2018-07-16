import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {AppStore} from "../../../app/app-store";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutingComponentBase} from "../../../core/base-classes/routing-component-base";
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SourceService} from '../../_common/services/source.service';
import {Source} from '../../_common/models/source';
import {CuiTableOptions} from "@cisco-ngx/cui-components";
import {Observable} from "rxjs/index";
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from "../../../core/models/ui-enums";

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
  tableColumns = ['name', 'desc', 'status', 'edit'];
  dataSource: MatTableDataSource<Source>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterValue = '';

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private uiUtil: UiUtil
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

  confirmSave() {
    return this.uiUtil.genericDialog('Are you sure you want to save?', DialogType.okCancel);
  }

  save() {
    var source = new Source();
    source.name = this.sourceName;
    source.description = this.sourceDesc;
    source.status = this.sourceStatus;
    this.confirmSave()
      .subscribe(resp => {
        if (resp) {
          {
            //this.cleanUpSubmeasure();
            const errs = this.validate();
            if (!errs) {
              let obs: Observable<Source>;
              if (this.showEdit) {
                obs = this.sourceService.update(source);
              } else {
                obs = this.sourceService.add(source);
              }
              obs.subscribe(source => this.router.navigateByUrl('/admn/source'));
            } else {
              //this.uiUtil.genericDialog(this.errs.join('\n'));
            }
          }
        }
      });
  }

  validate() {
    //TODO: fill in source validation

    /*this.errs = [];
    const sm = this.sm;
    if (sm.rules.length > _.uniq(sm.rules).length) {
      this.errs.push('Duplicate rules entered');
    }
    return this.errs.length ? this.errs : null;*/
    return false;
  }

}
