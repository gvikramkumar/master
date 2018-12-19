import { Component, OnInit } from '@angular/core';
import {ExitCriteriaValidationService} from '../services/exit-criteria-validation.service';
import {MonetizationModelService} from '../services/monetization-model.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HeaderService} from '../header/header.service';

@Component({
  selector: 'app-exit-criteria-validation',
  templateUrl: './exit-criteria-validation.component.html',
  styleUrls: ['./exit-criteria-validation.component.css'],
  providers: [HeaderService]
})

export class ExitCriteriaValidationComponent implements OnInit {
  currentOfferId;
  exitCriteriaData;
  ideate = [];
  offerOwner:String = '';
  stakeData = {};
  requestApprovalAvailable:Boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private monetizationModelService: MonetizationModelService,
    private headerService: HeaderService,

    ) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
      });
     }

  ngOnInit() {
    this.exitCriteriaValidationService.getExitCriteriaData(this.currentOfferId).subscribe(data => {
      console.log(data);
      const canRequestUsers = [];
      this.exitCriteriaData=data;
      this.ideate = data['ideate'];
      this.offerOwner = data['offerOwner'];
      canRequestUsers.push(this.offerOwner);

      for (let i = 0; i < this.ideate.length; i++) {
        if (this.ideate[i]['status'] != 'completed') {
          this.requestApprovalAvailable = false;
          break;
        }
      }

      data['stakeholders'].forEach(sh => {
        if (sh['offerRole'] == 'co-owner') {
          canRequestUsers.push(sh['_id']);
        }
        if (this.stakeData[sh['offerRole']] == null) {
          this.stakeData[sh['offerRole']] = [];
        }
        this.stakeData[sh['offerRole']].push({name: sh['_id'], email: sh['email']});
      })

      let that = this;
      this.headerService.getCurrentUser().subscribe(user => {
        if (!canRequestUsers.includes(user)) {
          that.requestApprovalAvailable = false;
        }
      })
    });
  }

  actionStatusColor(status) {
    if (status === 'completed') {
      return 'green';
    } else if (status === 'pending') {
      return 'red';
    } else {
      return 'grey';
  }
}

updateStakeData(data) {
  // this.monetizationModelService.showStakeholders(this.currentMMModel, this.currentPrimaryBE).subscribe(res => {
  //   this.stakeData = {};
  //   let keyUsers = [];
  //   if (res != null && res[0] != null) {
  //     keyUsers = res[0]['coolRoleKeyUser'];
  //   }
  //   keyUsers.forEach(user => {
  //     if (this.stakeData[user['offerRole']] == null) {
  //       this.stakeData[user['offerRole']] = [];
  //     }
  //     this.stakeData[user['offerRole']].push({name: user['keyUser'], email: user['email']});
  //   })
  // })
}

}