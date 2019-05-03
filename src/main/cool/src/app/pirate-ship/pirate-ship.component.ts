 import {Component, OnInit} from '@angular/core';
 import {ActivatedRoute, Router} from '@angular/router';
 import {PirateShipSharedService} from '@app/services/pirate-ship-shared.service';

@Component({
  template: '<router-outlet></router-outlet>'
})
export class pirateshipComponent implements OnInit{
  constructor(private router: Router,
              private route: ActivatedRoute,
               private _pirate_ship: PirateShipSharedService
              ) {

  }

  ngOnInit(): void {
    this._pirate_ship.setOfferIdandcaseId(this.route.snapshot.params);
  }

}
