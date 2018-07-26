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
          // Create one copy of active sources for each module
          this.sources.push(_.cloneDeep(activeSources));
        });
      });

    // Promise.all to get module/source mapping from module-lookup
    const promiseArr: Promise<any>[] = [];
    this.modules.forEach((module) => {
      promiseArr.push(this.moduleLookupService.get('sources', module.moduleId).toPromise());
    });

    Promise.all(promiseArr)
      .then(results => {
        // handle array of module sources
        this.selectedSources = results.map(x => x || []);
        this.orgSelectedSources = _.cloneDeep(this.selectedSources);
      });
  }

  save() {
    const promiseArr: Promise<any>[] = [];

    this.modules.forEach((module, idx) => {
      if (!_.isEqual(this.selectedSources[idx], this.orgSelectedSources[idx])) {
        promiseArr.push(this.moduleLookupService.upsert('sources', this.selectedSources[idx], module.moduleId).toPromise());
      }
    });

    Promise.all(promiseArr)
      .then(results => {
        this.toastService.showAutoHideToast('Submitted', 'Module-to-source mapping has been submitted successfully.', ToastSeverity.success);
      });
  }

}
