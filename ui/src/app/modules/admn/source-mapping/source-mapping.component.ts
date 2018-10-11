import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UiUtil} from '../../../core/services/ui-util';
import {AppStore} from '../../../app/app-store';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {DfaModule} from '../../../modules/_common/models/module';
import {SourceService} from '../../_common/services/source.service';
import {ToastService, ToastSeverity} from '../../../core/services/toast.service';
import {Source} from '../../../../../../shared/models/source';
import * as _ from 'lodash';
import {ModuleSource} from '../../_common/models/module_source';
import {ModuleSourceService} from '../../_common/services/module-source.service';

@Component({
  selector: 'fin-source-mapping',
  templateUrl: './source-mapping.component.html',
  styleUrls: ['./source-mapping.component.scss']
})
export class SourceMappingComponent extends RoutingComponentBase implements OnInit {

  modules: DfaModule[];
  sources: Source[] = [];
  selectedSources: number[][] = [];
  orgSelectedSources: number[][] = [];

  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private toastService: ToastService,
    private uiUtil: UiUtil,
    private moduleSourceService: ModuleSourceService
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.modules = this.store.nonAdminModules;

    this.sourceService.getManyActive().toPromise()
      .then(sources => {
        this.sources = sources;
        this.refresh();
      });
  }

  refresh() {
    const promiseArr = [];
    this.moduleSourceService.getManySortByModuleId()
      .subscribe(modSourceArr => {
        this.selectedSources = this.modules.map(module => {
          const moduleSource = _.find(modSourceArr, {moduleId: module.moduleId});
          return moduleSource ? moduleSource.sources : [];
        })
        this.orgSelectedSources = _.cloneDeep(this.selectedSources);
      });
  }

  save() {
    const promises = [];
    this.modules.forEach((module, idx) => {
      if (!_.isEqual(this.selectedSources[idx], this.orgSelectedSources[idx])) {
        promises.push(this.moduleSourceService.upsert(new ModuleSource(module.moduleId, this.selectedSources[idx])).toPromise());
      }
    });

    if (promises.length) {
      Promise.all(promises)
        .then(() => {
          this.refresh();
          this.toastService.showAutoHideToast('Submitted',
            'Module-to-source mapping has been submitted successfully.', ToastSeverity.success);
        })
        .catch(err => {
          const i = 5;
        });
    }
  }

}
