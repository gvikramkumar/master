import { Component, OnInit } from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {DfaModule} from '../../../modules/_common/models/module';

interface Link {
  route: string;
  text: string;
}

@Component({
  selector: 'fin-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.scss']
})
export class LeftnavComponent {
  module: DfaModule;
  links: Link[] = [];
  alinks: Link[] = [];

  constructor(private store: AppStore) {
    this.store.subModule(module => {
      this.module = module;
      this.refresh();
    });
  }



  refresh() {
    if (!this.module) {
      return;
    }

    switch (this.module.abbrev) {
      case 'admn':
        this.links = [
          {route: '/admn/open-period', text: 'Open Period'},
          {route: '/admn/source', text: 'Sources'},
          {route: '/admn/source-mapping', text: 'Source Mapping'},
        ];
        this.alinks = [];
        break;

      case 'prof':
        this.links = [
          {route: '/prof/rule-management', text: 'Rule Management'},
          {route: '/prof/measure', text: 'Measure'},
          {route: '/prof/submeasure', text: 'Sub-Measure'},
          {route: '/prof/business-upload', text: 'Business Upload'},
          {route: '/prof/reports', text: 'Report'},
        ];
        this.alinks = [
          {route: '/prof/admin/source', text: 'Sources'},
        ];
        break;
      default:
        this.links = [];
        this.alinks = [];
        break;

    }


  }

}
