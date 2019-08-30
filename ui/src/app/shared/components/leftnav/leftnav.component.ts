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
          {route: '/admn/module', text: 'Module', roles: 'it administrator'},
          {route: '/admn/open-period', text: 'Open Period', roles: 'it administrator'},
          {route: '/admn/source', text: 'Source', roles: 'it administrator'},
          {route: '/admn/source-mapping', text: 'Source Mapping', roles: 'it administrator'},
        ];
        if (this.store.user.isGenericUser()) {
          this.alinks = [
            {route: '/admn/database-sync', text: 'Database Sync', roles: 'it administrator'}
          ];

        } else {
          this.alinks = [];
        }
        break;

      case 'prof':
        this.links = [
          {route: '/prof/rule-management', text: 'Rule Management', roles: 'profitability allocations:business admin,profitability allocations:super user, profitability allocations:business user, profitability allocations:end user'},
          {route: '/prof/submeasure', text: 'Sub-Measure', roles: 'profitability allocations:business admin,profitability allocations:super user, profitability allocations:business user, profitability allocations:end user'},
          {route: '/prof/business-upload', text: 'Business Upload', roles: 'profitability allocations:business admin, profitability allocations:super user, profitability allocations:business user'},
          {route: '/prof/reports', text: 'Report', roles: 'profitability allocations:business admin, profitability allocations:super user, profitability allocations:business user, profitability allocations:end user'},
        ];
        this.alinks = [
          {route: '/prof/admin/measure', text: 'Measure', roles: 'profitability allocations:business admin'},
          {route: '/prof/admin/approval', text: 'Approval', roles: 'profitability allocations:business admin'},
        ];
        break;
      
      case 'bkgm':
      this.links = [
        {route: '/bkgm/rule-management', text: 'Rule Management', roles: 'bookings misc allocations:business admin,bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user'},
        {route: '/bkgm/submeasure', text: 'Sub-Measure', roles: 'bookings misc allocations:business admin,bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user'},
        {route: '/bkgm/reports', text: 'Report', roles: 'bookings misc allocations:business admin, bookings misc allocations:super user, bookings misc allocations:business user, bookings misc allocations:end user'},
      ];
      this.alinks = [
        {route: '/bkgm/admin/measure', text: 'Measure', roles: 'bookings misc allocations:business admin'},
        {route: '/bkgm/admin/approval', text: 'Approval', roles: 'bookings misc allocations:business admin'},
        {route: '/bkgm/admin/processing-date-input', text: 'Processing Date - Input', roles: 'bookings misc allocations:business admin'}
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
