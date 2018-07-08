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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends RoutingComponentBase implements OnInit {
  public modules1: DfaModule[];
  public modules2: DfaModule[];
  selectedModule: DfaModule;

  constructor(private store: AppStore, route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
    this.modules1 = this.store.modules.slice(0, 6);
    this.modules2 = this.store.modules.slice(6);
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
