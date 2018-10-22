import {Component, OnInit, ViewChild} from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ModuleService} from '../../_common/services/module.service';
import {DfaModule} from '../../_common/models/module';
import {Observable} from 'rxjs/index';
import {UiUtil} from '../../../core/services/ui-util';
import * as _ from 'lodash';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'fin-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent extends RoutingComponentBase implements OnInit {
  errs: string[];
  formTitle: string;
  modules: DfaModule[] = [];
  formModules: DfaModule[] = []; // todo: use this to fix validation
  moduleNames: string[];
  abbrevs: string[];
  displayOrders: number[];
  module = new DfaModule();
  editMode: boolean;
  showForm = false;
  tableColumns = ['name', 'abbrev', 'displayOrder', 'status'];
  dataSource: MatTableDataSource<DfaModule>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') form: NgForm;
  UiUtil = UiUtil;
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
    this.moduleService.getNonAdminSortedByDisplayOrder()
      .subscribe(modules => {
        this.modules = modules;
          // .filter(module => !shUtil.isAdminModuleId(module.moduleId));
        this.dataSource = new MatTableDataSource<DfaModule>(this.modules);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // populate lists for each attribute for validation
        this.moduleNames = this.modules.map(module => module.name);
        this.abbrevs = this.modules.map(module => module.abbrev);
        this.displayOrders = this.modules.map(module => module.displayOrder);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFormIfAlreadyUp() {
    if (this.showForm && this.form) {
      this.form.reset();
    }
  }
  addModule() {
    this.clearFormIfAlreadyUp();
    // update form modules to include all modules
    this.formModules = this.modules;
    this.module = new DfaModule();
    this.editMode = false;
    this.formTitle = 'Add New Module';
    this.showForm = true;
  }

  editModule(module) {
    this.clearFormIfAlreadyUp();
    // update form modules
    // to include all modules, then remove current module from list
    this.formModules = _.without(this.modules, module);
    // hack: if we don't do this setTimeout, when you click on an edit link a second time
    // the edit form stays blank. detectChanges() doesn't help, but this does
    setTimeout(() => this.module = _.cloneDeep(module));
    this.editMode = true;
    this.formTitle = 'Edit Module';
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
  }

  save() {
    if (this.form.valid) {
      let obs: Observable<DfaModule>;
      if (this.editMode) {
        obs = this.moduleService.update(this.module);
      } else {
        obs = this.moduleService.add(this.module);
      }
      obs.subscribe(() => {
        this.refresh();
        this.moduleService.refreshStore();
        this.uiUtil.toast('Module saved.')
      });
    }
  }

  validate() {
    this.errs = [];
    return this.errs.length ? this.errs : null;
  }

}
