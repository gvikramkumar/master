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

  public modules: DfaModule[];
  headerOptions;

  constructor(private store: AppStore) {
  }

  ngOnInit() {
    this.headerOptions = this.store.headerOptions;
    this.modules = this.store.modules;
  }

  moduleChange(module) {
    this.store.updateModule(module.moduleId);
  }


}
