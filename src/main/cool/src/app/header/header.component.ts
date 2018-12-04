import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { HeaderService } from './header.service';
import { UserService } from '../services/user.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers:[HeaderService]
})
export class HeaderComponent implements OnInit {

  toggleLogout = false;

  userInfo;
  userFirstName;
  userLastName;
  functionalRole;

  ngOnInit() {
  }

  constructor(private headerService: HeaderService, private router: Router, private createOfferService: CreateOfferService, private userService : UserService) {
    // this.selectedIndex = 2;
    this.headerService.getUserInfo().subscribe((data:any) => {
      this.userFirstName = data.firstName;
      this.userLastName = data.lastName;
    });
	
	this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.functionalRole = data.functionalAppRoleList[0].fnalRole;
    });

  }

  getPage(p) {
    return this.router.url.search(p) > -1;
  }

  onClickedOutside() {
    this.toggleLogout=false;
  }
}
