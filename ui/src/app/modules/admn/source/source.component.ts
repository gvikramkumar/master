import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SourceService} from '../../_common/services/source.service';
import {Source} from '../../_common/models/source';
import {CuiTableOptions} from '@cisco-ngx/cui-components';
import {Observable} from 'rxjs/index';
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from '../../../core/models/ui-enums';

@Component({
  selector: 'fin-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent extends RoutingComponentBase implements OnInit {
  formTitle: string;
  sources: Source[] = [];
  source: Source;
  editMode: boolean;
  showForm = false;
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

  isStatusActive(status) {
    return status === 'A';
  }

  addSource() {
    this.source = new Source();
    this.source.active = this.isStatusActive(this.source.status);
    this.editMode = false;
    this.showForm = true;
    this.formTitle = 'Add New Source';
  }

  editSource(source) {
    this.source = source;
    this.source.active = this.isStatusActive(this.source.status);
    this.editMode = true;
    this.showForm = true;
    this.formTitle = 'Edit Source';
  }

  cleanSource() {
    this.source.status = this.source.active ? 'A' : 'I';
  }

  confirmSave() {
    return this.uiUtil.genericDialog('Are you sure you want to save?', DialogType.okCancel);
  }

  save() {
    this.confirmSave()
      .subscribe(resp => {
        if (resp) {
          {
            this.cleanSource();
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
              // this.uiUtil.genericDialog(this.errs.join('\n'));
            }
          }
        }
      });
  }

  validate() {
    // TODO: fill in source validation

    /*this.errs = [];
    const sm = this.sm;
    if (sm.rules.length > _.uniq(sm.rules).length) {
      this.errs.push('Duplicate rules entered');
    }
    return this.errs.length ? this.errs : null;*/
    return false;
  }

}
