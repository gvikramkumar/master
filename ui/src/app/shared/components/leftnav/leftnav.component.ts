import { Component, OnInit } from '@angular/core';
import {AppStore} from '../../../app/app-store';
import {DfaModule} from '../../../modules/_common/models/module';
import AnyObj from '../../../../../../shared/models/any-obj';

interface Link {
  route: string;
  text: string;
  roles: string;
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
          {route: '/admn/module', text: 'Module', roles: 'itadmin'},
          {route: '/admn/open-period', text: 'Open Period', roles: 'itadmin'},
          {route: '/admn/source', text: 'Source', roles: 'itadmin'},
          {route: '/admn/source-mapping', text: 'Source Mapping', roles: 'itadmin'},
        ];
        this.alinks = [];
        break;

      case 'prof':
        this.links = [
          {route: '/prof/rule-management', text: 'Rule Management', roles: 'prof:admin,prof:super-user, prof:end-user'},
          {route: '/prof/submeasure', text: 'Sub-Measure', roles: 'prof:admin,prof:super-user, prof:end-user'},
          {route: '/prof/business-upload', text: 'Business Upload', roles: 'prof:admin, prof:super-user'},
          {route: '/prof/reports', text: 'Report', roles: 'prof:admin, prof:super-user, prof:end-user'},
        ];
        this.alinks = [
          {route: '/prof/admin/measure', text: 'Measure', roles: 'prof:admin'},
        ];
        break;
      default:
        this.links = [];
        this.alinks = [];
        break;
    }

    this.links = this.store.user.authorizeObjects<Link>(this.links, 'roles');
    this.alinks = this.store.user.authorizeObjects<Link>(this.alinks, 'roles');
  }

}
