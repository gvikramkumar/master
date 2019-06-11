import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { HeaderService } from '../../services/header.service';
import { CreateOfferService, DashboardService } from '@shared/services';
import { ConfigurationService } from '../../services/configuration.service';
import { AccessManagementService } from '@app/services/access-management.service';
import { PirateShipSharedService } from '@app/services/pirate-ship-shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {

  userId;
  userInfo;
  userName;
  functionalRole;
  selectedValues;

  hasAdminAccess = false;
  isBupmUser: Boolean = false;
  emailPrefOptions: any[] = [];
  notificationPrefOptions: any[] = [];

  totalActionCount: number;

  public userRole;
  public rolesCollection = [];
  public hideListElm = false;
  public allowNavigate: boolean;
  public addArrowClass = false;

  // -----------------------------------------------------------------------------------------

  constructor(
    private userService: UserService,
    private headerService: HeaderService,
    private dashboardService: DashboardService,
    private startupService: ConfigurationService, 
    private createOfferService: CreateOfferService,
    private _pirshipService: PirateShipSharedService,

    private accessMgmtServ: AccessManagementService) {

    this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this.accessMgmtServ.sendFromUserRegistration
        .subscribe((user: any) => {
          if (user.userId === this.userId) {
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
      if (data.userMappings[0].functionalRole.substring(0, 7) === "COOL - ") {
        this.functionalRole = data.userMappings[0].functionalRole.substring(7);
      } else {
        this.functionalRole = data.userMappings[0].functionalRole;
      }
      this.accessMgmtServ.sendfunctionalRolRaw.next(data.userMappings[0].functionalRole);
      this._pirshipService.setRole(this.functionalRole);
      this.userService.setFunctionalRole(this.functionalRole);
    });

  }
  // -----------------------------------------------------------------------------------------


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

    this.dashboardService.getMyActionsList()
      .subscribe(resActionsAndNotifications => {

        if (resActionsAndNotifications && resActionsAndNotifications.actionList) {
          const pendingActionCount = resActionsAndNotifications.pendingTasksCount;
          const needImmediateActionCount = resActionsAndNotifications.immediateTasksCount;
          this.totalActionCount = pendingActionCount + needImmediateActionCount;
        }

      });

  }

  // -----------------------------------------------------------------------------------------

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

  // -----------------------------------------------------------------------------------------


}
