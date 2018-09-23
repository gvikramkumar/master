import {AfterViewInit, ApplicationRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {AppStore} from '../../../../app/app-store';
import * as _ from 'lodash';
import {DfaModule} from '../../../../modules/_common/models/module';
import {uiConst} from '../../../../core/models/ui-const';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../../../app/app.component';
import {shUtil} from '../../../../../../../shared/shared-util';
import AnyObj from '../../../../../../../shared/models/any-obj';
import {LookupService} from '../../../../modules/_common/services/lookup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends RoutingComponentBase implements OnInit {
  public modules: DfaModule[];
  selectedModule: DfaModule;
  adminModule: DfaModule;
  roles = [
    {generic: 'itadmin', actual: 'itadmin'},
    {generic: 'bizadmin', actual: 'prof:admin'},
    {generic: 'super-user', actual: 'prof:super-user'},
    {generic: 'end-user', actual: 'prof:end-user'},
    ];
  selectedRole: string;

  constructor(private store: AppStore, route: ActivatedRoute, private lookupService: LookupService) {
    super(store, route);
    this.selectedRole = this.store.user.roles[0]; // assuming one role for this operation
  }

  ngOnInit() {
    this.modules = this.store.user.authorizeObjects<DfaModule>(this.store.nonAdminModules, 'roles');
    this.adminModule = this.store.adminModule;
    if (this.store.module) {
      this.selectedModule = this.store.module;
    } else {
      this.moduleChange(this.store.modules[0]);
    }
  }

  moduleChange(module) {
    this.selectedModule = module;
    this.store.pubModule(module.moduleId);
  }

  roleChange() {
    this.lookupService.upsert(this.store.user.id, [this.selectedRole])
      .subscribe(() => window.location.reload());
  }

}
