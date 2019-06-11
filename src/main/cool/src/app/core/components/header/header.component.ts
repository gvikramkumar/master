import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/common/shared-service.service';

import { CreateOfferService } from '@shared/services';
import { HeaderService } from '../../services/header.service';
import { UserService } from '../../services/user.service';
import { ConfigurationService } from '../../services/configuration.service';
import {PirateShipSharedService} from '@app/services/pirate-ship-shared.service';
import { AccessManagementService } from '@app/services/access-management.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {

  userInfo;
  userName;
  functionalRole;
  userId;
  emailPrefOptions: any[] = [];
  notificationPrefOptions: any[] = [];
  isBupmUser: Boolean = false;
  hasAdminAccess = false;
  selectedValues;
  public userRole;
  public rolesCollection = [];
  public hideListElm = false;
  public allowNavigate: boolean;
  public addArrowClass = false;

  ngOnInit() {

    this.emailPrefOptions = [
      {
        name: 'Real Time',
        value: false
      },
      {
        name: 'Once Weekly',
        value: false
      },
      {
        name: 'Once Daily',
        value: false
      }];

    this.notificationPrefOptions = [
      {
        name: 'Real Time',
        value: false
      },
      {
        name: 'Once Weekly',
        value: false
      },
      {
        name: 'Once Daily',
        value: false
      }];
  }

  constructor(private headerService: HeaderService, private router: Router,
    private _pirshipService: PirateShipSharedService,
    private userService: UserService,
    private createOfferService: CreateOfferService,
    private startupService: ConfigurationService, private sharedService: SharedService,
    private accessMgmtServ: AccessManagementService) {

    this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this.accessMgmtServ.sendFromUserRegistration
      .subscribe((user:any)=> {
        if(user.userId === this.userId) {
          this.functionalRole = user.userMapping[0].functionalRole;
        }
      })
      this._pirshipService.setUserId(this.userId);
      this.headerService.getUserInfo(user).subscribe((data: any) => {
        this.userName = data[0].cn;
        this._pirshipService.setUserName(this.userName);
      });

      this.hasAdminAccess = this.startupService.startupData['hasAdminAccess'];

    });

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      // this.functionalRole = data.userMappings[0].functionalRole;
      // this._pirshipService.setRole(this.functionalRole);
      // this.userService.setFunctionalRole( this.functionalRole);
      // if (this.functionalRole === 'BUPM' || this.functionalRole === 'CXPM') {
      //   this.isBupmUser = true;
      //   this.sharedService.userEventEmit.next(true);
      // } else {
      //   this.sharedService.userEventEmit.next(false);
      // }
      if(data.userMappings[0].functionalRole.substring(0,7)==="COOL - ") {
        this.functionalRole = data.userMappings[0].functionalRole.substring(7);
      } else {
        this.functionalRole = data.userMappings[0].functionalRole;
      }
      this.accessMgmtServ.sendfunctionalRolRaw.next(data.userMappings[0].functionalRole);
      this._pirshipService.setRole(this.functionalRole);
      this.userService.setFunctionalRole(this.functionalRole);
    });

  }

  emailCheckBoxClicked(name) {
    this.emailPrefOptions.forEach(pref => {
      if (pref.name !== name) {
        pref.value = !pref.value;
      }
    });
  }

  notificationCheckBoxClicked(name) {
    this.notificationPrefOptions.forEach(pref => {
      if (pref.name !== name) {
        pref.value = !pref.value;
      }
    });
  }

}
