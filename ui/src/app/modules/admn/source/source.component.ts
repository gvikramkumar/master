import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SourceService} from '../../_common/services/source.service';
import {Source} from '../../../../../../shared/models/source';
import {CuiInputComponent} from '@cisco-ngx/cui-components';
import {Observable} from 'rxjs/index';
import {UiUtil} from '../../../core/services/ui-util';
import * as _ from 'lodash';
import {DfaModule} from '../../_common/models/module';
import {ValidationInputComponent} from '../../../shared/components/validation-input/validation-input.component';
import {NgForm} from '@angular/forms';
import {ModuleSourceService} from '../../_common/services/module-source.service';

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
  moduleSourceMap: {module: DfaModule, sources: number[]}[];
  usingModuleNames: string[] = [];
  usingModuleNamesTooltip = '';
  tableColumns = ['name', 'typeCode', 'status'];
  dataSource: MatTableDataSource<Source>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(NgForm) form;
  // @ViewChild('nameInput') nameInput: ValidationInputComponent;
  UiUtil = UiUtil;
  filterValue = '';

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private uiUtil: UiUtil,
    private moduleSourceService: ModuleSourceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(store, route);

  }

  ngOnInit() {
    this.refresh();
    this.getModuleSouceMap();
  }

  getModuleSouceMap() {
    this.moduleSourceService.getManySortByModuleId()
      .subscribe(moduleSourceArr => {
        this.moduleSourceMap =  this.store.nonAdminModules.map(module => {
          const moduleSource = _.find(moduleSourceArr, {moduleId: module.moduleId});
          return {
            module,
            sources: moduleSource ? moduleSource.sources : []
          };
        });
      });
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
    this.usingModuleNames = [];
    this.source = new Source();
    this.editMode = false;
    this.formTitle = 'Add New Source';
    this.doShowForm();
  }

  editSource(source) {
    this.source = _.cloneDeep(source);
    this.editMode = true;
    this.formTitle = 'Edit Source';
    this.checkModuleUse(source.sourceId);
    this.doShowForm();
  }

  doShowForm() {
    this.showForm = true;
    // this.changeDetectorRef.detectChanges();
/*
    setTimeout(() => {
      const elem = <any>document.querySelector('.edit-form-container .name-input input');
      elem.focus();
    });
*/
  }

  checkModuleUse(sourceId) {
    const maps = this.moduleSourceMap.filter(map => _.includes(map.sources, sourceId));
    if (maps.length) {
      this.usingModuleNames = maps.map(map => map.module.name);
      this.usingModuleNamesTooltip = 'Source is in use by the following modules: ';
      this.usingModuleNamesTooltip += maps.map(map => map.module.name).join(', ');
    } else {
      this.usingModuleNames = [];
    }
  }

  cancel() {
    this.showForm = false;
  }

  save() {
    if (this.form.invalid) {
      UiUtil.triggerBlur('.edit-form-container form');
      return;
    }

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
      this.uiUtil.genericDialog('Validation Errors', this.errs.join('\n'));
    }
  }

  validate() {
    this.errs = [];
    return this.errs.length ? this.errs : null;
  }

}
