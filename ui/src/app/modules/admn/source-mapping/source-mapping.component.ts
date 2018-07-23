import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SourceService} from '../../_common/services/source.service';
import {UiUtil} from '../../../core/services/ui-util';
import {AppStore} from '../../../app/app-store';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {DfaModule} from '../../../modules/_common/models/module';
import {shUtil} from '../../../../../../shared/shared-util';

@Component({
  selector: 'fin-source-mapping',
  templateUrl: './source-mapping.component.html',
  styleUrls: ['./source-mapping.component.scss']
})
export class SourceMappingComponent extends RoutingComponentBase implements OnInit {

  modules: DfaModule[];

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
    this.modules = this.store.modules.filter(module => !shUtil.isAdminModuleId(module.moduleId));
  }

  sampleItems = ['one','two','three'];
  sample: string;

}
