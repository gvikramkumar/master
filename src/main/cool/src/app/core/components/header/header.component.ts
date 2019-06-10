import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/common/shared-service.service';

import { CreateOfferService, DashboardService } from '@shared/services';
import { HeaderService } from '../../services/header.service';
import { UserService } from '../../services/user.service';
import { ConfigurationService } from '../../services/configuration.service';
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

  // -----------------------------------------------------------------------------------------

  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private headerService: HeaderService,
    private dashboardService: DashboardService,
    private startupService: ConfigurationService,
    private createOfferService: CreateOfferService,
    private _pirshipService: PirateShipSharedService,
  ) {

    this.totalActionCount = 0;

    this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this._pirshipService.setUserId(this.userId);
      this.headerService.getUserInfo(user).subscribe((data: any) => {
        this.userName = data[0].cn;
        this._pirshipService.setUserName(this.userName);
      });

      this.hasAdminAccess = this.startupService.startupData['hasAdminAccess'];

    });

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.functionalRole = data.userMappings[0].functionalRole;
      this._pirshipService.setRole(this.functionalRole);
      this.userService.setFunctionalRole(this.functionalRole);
      if (this.functionalRole === 'BUPM' || this.functionalRole === 'CXPM') {
        this.isBupmUser = true;
        this.sharedService.userEventEmit.next(true);
      } else {
        this.sharedService.userEventEmit.next(false);
      }
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
