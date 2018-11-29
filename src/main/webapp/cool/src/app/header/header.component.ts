import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { HeaderService } from './header.service';
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

  ngOnInit() {
  }

  constructor(private headerService: HeaderService, private router: Router, private createOfferService: CreateOfferService) {
    // this.selectedIndex = 2;
    this.headerService.getUserInfo().subscribe((data:any) => {
      this.userFirstName = data.firstName;
      this.userLastName = data.lastName;
    });
  }

  getPage(p) {
    return this.router.url.search(p) > -1;
  }

  onClickedOutside() {
    this.toggleLogout=false;
  }
  
  createNewOffer() {
    this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    this.createOfferService.currenTOffer.next('')
    this.router.navigate(['/cool']);
  }
}
