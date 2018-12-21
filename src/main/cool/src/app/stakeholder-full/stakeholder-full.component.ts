import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stakeholder-full',
  templateUrl: './stakeholder-full.component.html',
  styleUrls: ['./stakeholder-full.component.css']
})
export class StakeholderFullComponent implements OnInit {
  currentOfferId;
  offerId;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.offerId = params['id'];
    });
   }

  ngOnInit() {
  }

  onStrategyReview() {
    this.router.navigate(['/strategyReview', this.currentOfferId]);
  }

  offerDetailOverView() {
    this.router.navigate(['/offerDetailView', this.offerId]);
  }

}
