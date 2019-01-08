import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { HeaderService } from './header.service';
import { UserService } from '../services/user.service'
import { SelectItem } from 'primeng/api';
import { AccessManagementService } from '../services/access-management.service';
import { ConfigurationService } from '../services/configuration.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {

  toggleLogout = false;

  userInfo;
  userName;
  functionalRole;
  userId;
  emailPrefOptions: SelectItem[];
  isBupmUser: Boolean = false;
  hasAdminAccess:boolean = false;


  ngOnInit() {
  }

  constructor(private headerService: HeaderService, private router: Router,
    private createOfferService: CreateOfferService, private userService: UserService,
    private startupService:ConfigurationService) {

      this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this.headerService.getUserInfo(user).subscribe((data: any) => {
        this.userName = data[0].cn;
      });

      this.hasAdminAccess = this.startupService.startupData['hasAdminAccess'];

    });

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.functionalRole = data.userMappings[0].functionalRole;
      if (this.functionalRole === 'BUPM') {
        this.isBupmUser = true;
      }
    });




    this.emailPrefOptions= [
      {label: 'Realtime', value: 'Realtime' },
      {label: 'Once Weekly', value: 'Once Weekly' },
      {label: 'Once Daily', value: 'Once Daily' }
    ]
  }

  getPage(p) {
    return this.router.url.search(p) > -1;
  }

  onClickedOutside() {
    this.toggleLogout = false;
  }
}
