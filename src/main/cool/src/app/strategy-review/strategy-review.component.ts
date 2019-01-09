import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MonetizationModelService } from '../services/monetization-model.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {Location} from '@angular/common';
import { StakeholderfullService } from '../services/stakeholderfull.service';

@Component({
  selector: 'app-strategy-review',
  templateUrl: './strategy-review.component.html',
  styleUrls: ['./strategy-review.component.css']
})
export class StrategyReviewComponent implements OnInit {
  offerData: any;
  currentOfferId;
  caseId;
  bviewDeckData: any[];
  
  choiceSelected;
  groups = {};
  groupKeys = [];
  groupNames=[];
  groupData = [];
  message = {};
  stakeData = {};
  newDataArray =[];
  offerBuilderdata = {};
  minDate: Date;

  public data =[];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  formTitle: any = ' ';
  totalApprovalsCount: any = 0;
  approvedCount: any = 0;
  conditionallyApprovedCount: any = 0;
  notApprovedCount: any = 0;
  notReviewedCount: any = 0;
  showButtonSection = false;
  showFormSection = false;
  strategyReviewList = [
    {
      function : 'CPS',
      approvalStatus : 'Approved',
      reviewedOn : '11-Aug-2018',
      reviewedBy : 'Sean Parker (OPS)',
      comment : 'Comment'
    },
    {
      function : 'Compensation Ops',
      approvalStatus : 'Not Approved',
      reviewedOn : '08-Aug-2018',
      reviewedBy : 'Thomas Price',
      comment : 'Comment'
    },
    {
      function : 'Compensation Ops',
      approvalStatus : 'Not Reviewed'
    },
    {
      function : 'Compensation Ops',
      approvalStatus : 'Conditionally Approved',
      reviewedOn : '06-Aug-2018',
      reviewedBy : 'Jessica Lara',
      comment : 'Comment'
    },
    {
      function : 'Compensation Ops',
      approvalStatus : 'Conditionally Approved',
      reviewedOn : '06-Aug-2018',
      reviewedBy : 'Jessica Lara',
      comment : 'Comment'
    }
  ];
  firstData: Object;
  stakeHolderInfo: any;

  constructor(private router: Router,
    private stakeholderfullService:StakeholderfullService,
    private monetizationModelService: MonetizationModelService,
    private activatedRoute: ActivatedRoute,
    private _location: Location) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
        this.caseId = params['id2'];
      });
    }

  ngOnInit() {
    this.data = [];
    this.message = {
      contentHead: 'Great Work!',
      content: 'Strategy review message.',
      color: 'black'
    };
    this.showButtonSection = true;
    this.showFormSection = false;
    this.totalApprovalsCount = this.strategyReviewList.length;
    this.strategyReviewList.forEach(element => {
      if (element.approvalStatus === 'Approved') {
        this.approvedCount = this.approvedCount + 1;
      } else if (element.approvalStatus === 'Not Approved') {
        this.notApprovedCount = this.notApprovedCount + 1;
      } else if (element.approvalStatus === 'Conditionally Approved') {
        this.conditionallyApprovedCount = this.conditionallyApprovedCount + 1;
      } else if (element.approvalStatus === 'Not Reviewed') {
        this.notReviewedCount = this.notReviewedCount + 1;
      }
    });

    this.stakeholderfullService.getdata(this.currentOfferId).subscribe(data => {
    
      this.firstData = data;
      console.log("firstData",data);
      this.data = this.firstData['stakeholders'];
      this.stakeHolderInfo = {};
     // this.processStakeHolderData(this.data);
      console.log("data",this.data[0].offerRole);
      for(let i=0;i<= this.data.length -1;i++){
        if (this.stakeHolderInfo[this.data[i]['offerRole']] == null) {
          this.stakeHolderInfo[this.data[i]['offerRole']] = [];
        }
        
        this.stakeHolderInfo[this.data[i]['offerRole']].push(
          {
            userName: this.data[i]['name'],
            emailId: this.data[i]['_id'] + '@cisco.com',
            _id: this.data[i]['_id'],
            businessEntity: this.data[i]['businessEntity'],
            functionalRole: this.data[i]['functionalRole'],
            offerRole: this.data[i]['offerRole'],
            stakeholderDefaults:this.data[i]['stakeholderDefaults']
           
          });
      
      }
      this.stakeData=this.stakeHolderInfo; 
      console.log("this stakedate",this.stakeData);
      console.log("data",typeof(this.newDataArray));

     
    });
    
    this.dpConfig = Object.assign({}, { containerClass: 'theme-blue', showWeekNumbers: false });
    this.minDate = new Date();
    this.monetizationModelService.getAttributes().subscribe(data => {
      this.offerData = data;
      this.offerData['groups'].forEach(group => {
        this.groupNames.push(group['groupName']);
        const curGroup = {};
        group['subGroup'].forEach(g => {
          curGroup[g['subGroupName']] = [];
          g.choices.forEach((c) => {
            curGroup[g['subGroupName']].push({ name: c, type: 0, status: -1 });
          });
        });
        this.groupData.push(curGroup);
      });
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

  
  processStakeHolderData(stakeHolderData) {

    stakeHolderData.forEach(stakeHolder => {

      if (this.stakeHolderInfo[stakeHolder['offerRole']] == null) {
        this.stakeHolderInfo[stakeHolder['offerRole']] = [];
      }
      
      this.stakeHolderInfo[stakeHolder['offerRole']].push(
        {
          name: stakeHolder['name'],
          email: stakeHolder['_id'] + '@cisco.com',
          _id: stakeHolder['_id'],
          businessEntity: stakeHolder['businessEntity'],
          functionalRole: stakeHolder['functionalRole'],
          offerRole: stakeHolder['offerRole'],
          stakeholderDefaults: stakeHolder['stakeholderDefaults']
         
        });

        this.stakeData=this.stakeHolderInfo; 
        console.log("this stakedate",this.stakeData);
    });
  }

  updateMessage(message) {

    if (message != null && message !== '') {
      if (message === 'hold') {
        this.message = {
          contentHead: '',
          content: 'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black' };
      } else if (message === 'cancel') {
        this.message = {
          contentHead: '',
          content: 'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black' };

      }
    }
  }


  goBack() {
   // this._location.back();
   // this.router.navigate(['/stakeholderFull',this.currentOfferId]);
   this.router.navigate(['/stakeholderFull', this.currentOfferId, this.caseId]);
  }


  offerDetailOverView() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }

  doNotApprove() {
    this.formTitle = 'Do Not Approve';
    this.showButtonSection = false;
    this.showFormSection = true;
  }

  conditionalApprove() {
    this.formTitle = 'Conditional Approval';
    this.showFormSection = true;
    this.showButtonSection = false;
  }

  closeForm() {
    this.showButtonSection = true;
    this.showFormSection = false;
  }

}
