import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService, CreateOfferService } from '@shared/services';
import { HeaderService } from '@shared/services';
import { SharedService } from '@app/shared-service.service';

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
  hasAdminAccess: boolean = false;
  selectedValues;

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
    private createOfferService: CreateOfferService,
    private startupService: ConfigurationService, private sharedService:SharedService) {

    this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this.headerService.getUserInfo(user).subscribe((data: any) => {
        this.userName = data[0].cn;
      });

      this.hasAdminAccess = this.startupService.startupData['hasAdminAccess'];

    });

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.functionalRole = data.userMappings[0].functionalRole;
      if (this.functionalRole === 'BUPM' || this.functionalRole === 'CXPM') {
        this.isBupmUser = true;
        this.sharedService.userFunctionalRole.next(true) ;
      }else{
        this.sharedService.userFunctionalRole.next(false) ;
      }
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

  /**
   * Logic when user closes the panel.
   */
  onClickedOutside() {

  }
}
