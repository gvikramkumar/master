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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends RoutingComponentBase implements OnInit {
  public modules: DfaModule[];
  selectedModule: DfaModule;
  adminModule: DfaModule;

  profDesc = 'This capability performs allocations at the multiple dimensions/hierarchies such as Sales Theater Level and Product Family Level used for Company\'s Profit/Loss (P/L) reporting to drive profitable growth.';


  constructor(private store: AppStore, route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
    this.modules = this.store.user.authorizeObjects<DfaModule>(this.store.nonAdminModules, 'authorization');
    this.modules[0].desc = 'This capability performs allocations at the multiple dimensions/hierarchies such as Sales Theater Level and Product Family Level used for Company\'s Profit/Loss (P/L) reporting to drive profitable growth.'
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

}
