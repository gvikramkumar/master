import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UiUtil} from '../../../core/services/ui-util';
import {AppStore} from '../../../app/app-store';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {DfaModule} from '../../../modules/_common/models/module';
import {ModuleLookupService} from '../../_common/services/module-lookup.service';
import {SourceService} from '../../_common/services/source.service';
import {ToastService, ToastSeverity} from '../../../core/services/toast.service';
import {Source} from '../../_common/models/source';
import {shUtil} from '../../../../../../shared/shared-util';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';

@Component({
  selector: 'fin-source-mapping',
  templateUrl: './source-mapping.component.html',
  styleUrls: ['./source-mapping.component.scss']
})
export class SourceMappingComponent extends RoutingComponentBase implements OnInit {

  modules: DfaModule[];
  sources: Source[][] = [];
  selectedSources: number[][] = [];
  orgSelectedSources: number[][] = [];

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private moduleLookupService: ModuleLookupService,
    private toastService: ToastService,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.modules = this.store.nonAdminModules;

    this.sourceService.getMany({status: 'A'}).toPromise()
      .then(activeSources => {
        this.modules.forEach(module => {
          this.sources.push(_.cloneDeep(activeSources));
        });
      });
    this.getModuleSouceMap();
  }

  getModuleSouceMap() {
    const promiseArr = [];
    this.moduleLookupService.getOneValueManyModules('sources',
      this.store.nonAdminModules.map(m => m.moduleId))
      .subscribe(objs => {
        this.selectedSources =  objs.map(obj => obj.value || []);
        this.orgSelectedSources = _.cloneDeep(this.selectedSources);
      });
  }

  save() {
    const upserts = [];
    this.modules.forEach((module, idx) => {
      if (!_.isEqual(this.selectedSources[idx], this.orgSelectedSources[idx])) {
        upserts.push({moduleId: module.moduleId, key: 'sources', value: this.selectedSources[idx]});
      }
    });

    if (upserts.length) {
      this.moduleLookupService.upsertMany(upserts)
        .subscribe(() => {
          this.toastService.showAutoHideToast('Submitted',
            'Module-to-source mapping has been submitted successfully.', ToastSeverity.success);
        });
    }
  }

}
