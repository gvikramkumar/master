import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { HeaderService } from './header.service';
import { UserService } from '../services/user.service'
import { SelectItem } from 'primeng/api';
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

  ngOnInit() {
  }

  constructor(private headerService: HeaderService, private router: Router, private createOfferService: CreateOfferService, private userService: UserService) {
    // this.selectedIndex = 2;

    this.headerService.getCurrentUser().subscribe((user: any) => {
      this.userId = user;
      this.headerService.getUserInfo(user).subscribe((data: any) => {
        this.userName = data[0].cn;
      });
    });

    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.functionalRole = data.functionalAppRoleList[0].fnalRole;
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
