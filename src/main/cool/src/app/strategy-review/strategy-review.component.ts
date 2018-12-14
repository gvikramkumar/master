import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '../services/monetization-model.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-strategy-review',
  templateUrl: './strategy-review.component.html',
  styleUrls: ['./strategy-review.component.css']
})
export class StrategyReviewComponent implements OnInit {
  offerData: any;
  currentOfferId;
  bviewDeckData: any[];
  choiceSelected;
  groups = {};
  groupKeys = [];
  message = {};
  stakeData = {};
  offerBuilderdata = {};
  minDate: Date;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  formTitle: any = ' ';

  constructor(private router: Router, private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
      });
     }

  ngOnInit() {
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.minDate = new Date();
    this.monetizationModelService.getAttributes().subscribe(data => {
      this.offerData = data;
      const defaultOfferDataGroups = this.offerData['groups'][0];
      defaultOfferDataGroups['subGroup'].forEach((g) => {
        this.groups[g['subGroupName']] = [];
        g.choices.forEach((c) => {
          this.groups[g['subGroupName']].push({ name: c, type: 0, status: -1 });
        });
      });
      this.groupKeys = Object.keys(this.groups);
    });

    this.monetizationModelService.getOfferBuilderData(this.currentOfferId).subscribe(data => {
      this.offerBuilderdata = data;
      this.offerBuilderdata['BEList'] = [];
      this.offerBuilderdata['BUList'] = [];
      if (this.offerBuilderdata['primaryBEList'] != null) {
        this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['primaryBEList']);
      }
      if (this.offerBuilderdata['secondaryBEList'] != null) {
        this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['secondaryBEList']);
      }
      if (this.offerBuilderdata['primaryBUList'] != null) {
        this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['primaryBUList']);
      }
      if (this.offerBuilderdata['secondaryBUList'] != null) {
        this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['secondaryBUList']);
      }
    });
  }

  offerDetailOverView() {
    this.router.navigate(['/offerDetailView', this.currentOfferId]);
  }

  doNotApprove() {
    this.formTitle = 'Do Not Approve';
    document.getElementById('formSection').style.visibility = 'visible';
    document.getElementById('buttonSection').style.visibility = 'hidden';
  }

  conditionalApprove() {
    this.formTitle = 'Conditional Approval';
    document.getElementById('formSection').style.visibility = 'visible';
    document.getElementById('buttonSection').style.visibility = 'hidden';
  }

  closeForm() {
    document.getElementById('formSection').style.visibility = 'hidden';
    document.getElementById('buttonSection').style.visibility = 'visible';
  }

}
