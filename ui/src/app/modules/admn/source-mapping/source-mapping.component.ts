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
import {SourceMappingService} from '../../_common/services/source-mapping.service';

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
    private toastService: ToastService,
    private uiUtil: UiUtil,
    private sourceMappingService: SourceMappingService
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.modules = this.store.nonAdminModules;

    this.sourceService.getManyActive().toPromise()
      .then(activeSources => {
        this.modules.forEach(module => {
          this.sources.push(_.cloneDeep(activeSources));
        });
      });
    this.refresh();
  }

  refresh() {
    const promiseArr = [];
    this.sourceMappingService.getModuleSourceArray()
      .subscribe(objs => {
        this.selectedSources =  objs.map(obj => obj.sources);
        this.orgSelectedSources = _.cloneDeep(this.selectedSources);
      });
  }

  save() {
    const arr = [];
    this.modules.forEach((module, idx) => {
      if (!_.isEqual(this.selectedSources[idx], this.orgSelectedSources[idx])) {
        arr.push({moduleId: module.moduleId, sources: this.selectedSources[idx]});
      }
    });

    if (arr.length) {
      this.sourceMappingService.updateModuleSourceArray(arr)
        .subscribe(() => {
          this.refresh();
          this.toastService.showAutoHideToast('Submitted',
            'Module-to-source mapping has been submitted successfully.', ToastSeverity.success);
        });
    }
  }

}
