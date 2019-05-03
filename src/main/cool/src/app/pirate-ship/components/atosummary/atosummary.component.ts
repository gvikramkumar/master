import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-atosummary',
  templateUrl: './atosummary.component.html',
  styleUrls: ['./atosummary.component.scss']
})
export class ATOSummaryComponent implements OnInit {
     offerId: string;
     selectedoffer: string;
  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // console.log('ato summary alreayd tigger');
    this.offerId = this.route.snapshot.params.offerId;
    this.selectedoffer = this.route.snapshot.params.selectedAto;
  }

  updateATo(seletedATO: any) {
    this.selectedoffer = seletedATO;
    console.log('this  place will call API for update' + seletedATO + 'pricing' + this.offerId);

  }

  back() {
    this.router.navigate(['../../offerset'],{relativeTo:this.route});
  }
}
