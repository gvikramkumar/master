import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {AppStore} from '../../../../app/app-store';
import * as _ from 'lodash';
import {DfaModule} from '../../../../modules/_common/models/module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public modules1: DfaModule[];
  public modules2: DfaModule[];
  headerOptions;
  selectedModule: DfaModule;

  constructor(private store: AppStore) {
  }

  ngOnInit() {
    this.headerOptions = _.clone(this.store.headerOptions);
    this.modules1 = this.store.modules.slice(0, 6);
    this.modules2 = this.store.modules.slice(6);
    if (this.store.module) {
      this.selectedModule = this.store.module;
    }
  }

  moduleChange(module) {
    this.selectedModule = module;
    this.store.pubModule(module.moduleId);
  }


}
