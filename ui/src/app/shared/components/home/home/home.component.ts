import {AfterViewInit, ApplicationRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {AppStore} from '../../../../app/app-store';
import _ from 'lodash';
import {DfaModule} from '../../../../modules/_common/models/module';
import {uiConst} from '../../../../core/models/ui-const';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../../../app/app.component';
import {shUtil} from '../../../../../../../shared/misc/shared-util';
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
    {generic: 'itadmin', actual: 'it administrator'},
    {generic: 'biz-admin', actual: 'profitability allocations:business admin'},
    {generic: 'super-user', actual: 'profitability allocations:super user'},
    {generic: 'biz-user', actual: 'profitability allocations:business user'},
    {generic: 'end-user', actual: 'profitability allocations:end user'},
    {generic: 'biz-admin', actual: 'bookings misc allocations:business admin'},
    {generic: 'super-user', actual: 'bookings misc allocations:super user'},
    {generic: 'biz-user', actual: 'bookings misc allocations:business user'},
    {generic: 'end-user', actual: 'bookings misc allocations:end user'}
    ];
  selectedRole: string;

  constructor(public store: AppStore, route: ActivatedRoute, private lookupService: LookupService) {
    super(store, route);
    this.selectedRole = this.store.user.roles[0]; // assuming one role for this operation
  }

  ngOnInit() {
    this.modules = this.store.user.authorizeObjects<DfaModule>(this.store.nonAdminModules, 'roles');
    this.adminModule = this.store.adminModule;
    if (this.store.module) {
      this.selectedModule = this.store.module;
    } else {
      let moduleName = this.selectedRole.split(':');
      if(moduleName[0] === 'bookings misc allocations'){
        this.moduleChange(this.store.modules[1]);
      }
      else {
        this.moduleChange(this.store.modules[0]);
      }
        
    }
  }

  moduleChange(module) {
    this.selectedModule = module;
    this.store.pubModule(module.moduleId);
  }

  roleChange() {
    this.store.showProgressBar();
    this.lookupService.upsert('localenv-roles', [this.selectedRole])
      .subscribe(() => window.location.reload());
  }

}
