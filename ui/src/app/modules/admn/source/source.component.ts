import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SourceService} from '../../_common/services/source.service';
import {Source} from '../../_common/models/source';
import {CuiInputComponent, CuiTableOptions} from '@cisco-ngx/cui-components';
import {Observable} from 'rxjs/index';
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from '../../../core/models/ui-enums';
import * as _ from 'lodash';

@Component({
  selector: 'fin-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent extends RoutingComponentBase implements OnInit {
  errs: string[];
  formTitle: string;
  sources: Source[] = [];
  source: Source;
  editMode: boolean;
  showForm = false;
  tableColumns = ['name', 'status', 'desc'];
  dataSource: MatTableDataSource<Source>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('nameInput') nameInput: CuiInputComponent;

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
    this.refresh();
  }

  refresh() {
    this.showForm = false;
    this.source = new Source();
    this.sourceService.getMany()
      .subscribe(sources => {
        this.sources = sources;
        this.dataSource = new MatTableDataSource<Source>(this.sources);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addSource() {
    this.source = new Source();
    this.editMode = false;
    this.formTitle = 'Add New Source';
    this.doShowForm();
  }

  editSource(source) {
    this.source = _.cloneDeep(source);
    this.editMode = true;
    this.formTitle = 'Edit Source';
    this.doShowForm();
  }

  doShowForm() {
    this.showForm = true;
    this.nameInput.inputElement.nativeElement.focus();
  }

  cancel() {
    this.showForm = false;
  }

  save() {
    const errs = this.validate();
    if (!errs) {
      let obs: Observable<Source>;
      if (this.editMode) {
        obs = this.sourceService.update(this.source);
      } else {
        obs = this.sourceService.add(this.source);
      }
      obs.subscribe(() => this.refresh());
    } else {
      this.uiUtil.genericDialog(this.errs.join('\n'));
    }
  }

  validate() {
    this.errs = [];
    return this.errs.length ? this.errs : null;
  }

}
