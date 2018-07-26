import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ModuleService} from '../../_common/services/module.service';
import {DfaModule} from '../../_common/models/module';
import {CuiInputComponent, CuiTableOptions} from '@cisco-ngx/cui-components';
import {Observable} from 'rxjs/index';
import {UiUtil} from '../../../core/services/ui-util';
import {DialogType} from '../../../core/models/ui-enums';
import * as _ from 'lodash';
import {shUtil} from '../../../../../../shared/shared-util';

@Component({
  selector: 'fin-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent extends RoutingComponentBase implements OnInit {
  errs: string[];
  formTitle: string;
  modules: DfaModule[] = [];
  module = new DfaModule();
  editMode: boolean;
  showForm = false;
  tableColumns = ['name', 'abbrev', 'displayOrder', 'status'];
  dataSource: MatTableDataSource<DfaModule>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('nameInput') nameInput: CuiInputComponent;

  filterValue = '';

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private uiUtil: UiUtil
  ) {
    super(store, route);

  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.showForm = false;
    this.module = new DfaModule();
    this.moduleService.getMany()
      .subscribe(modules => {
        this.modules = modules.filter(module => !shUtil.isAdminModuleId(module.moduleId));
        this.dataSource = new MatTableDataSource<DfaModule>(this.modules);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addModule() {
    this.module = new DfaModule();
    this.editMode = false;
    this.formTitle = 'Add New Module';
    this.doShowForm();
  }

  editModule(module) {
    this.module = _.cloneDeep(module);
    this.editMode = true;
    this.formTitle = 'Edit Module';
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
      let obs: Observable<DfaModule>;
      if (this.editMode) {
        obs = this.moduleService.update(this.module);
      } else {
        obs = this.moduleService.add(this.module);
      }
      obs.subscribe(() => {
        this.refresh();
        this.moduleService.refreshStore();
      });
    } else {
      this.uiUtil.genericDialog(this.errs.join('\n'));
    }
  }

  validate() {
    this.errs = [];
    return this.errs.length ? this.errs : null;
  }

}
