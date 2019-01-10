import { Component, OnInit, Input } from '@angular/core';
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
  @Input() stakeData:object;
  currentOfferId;
  currentCaseId;
  exitCriteriaData;
  ideate = [];
  offerOwner:String = '';
  requestApprovalAvailable:Boolean = true;
  

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private monetizationModelService: MonetizationModelService,
    private headerService: HeaderService,

    ) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
        this.currentCaseId = params['id2']
      });
     }

  ngOnInit() {
    this.exitCriteriaValidationService.getExitCriteriaData(this.currentCaseId).subscribe(data => {
      debugger;
      console.log(data);
      const canRequestUsers = [];
      this.exitCriteriaData=data;
      this.ideate = data['ideate'];
      // this.offerOwner = data['offerOwner'];
      // canRequestUsers.push(this.offerOwner);

      for (let i = 0; i < this.ideate.length; i++) {
        if (this.ideate[i]['status'] != 'Completed') {
          this.requestApprovalAvailable = false;
          break;
        }
      }

      // data['stakeholders'].forEach(sh => {
      //   if (sh['offerRole'] == 'co-owner') {
      //     canRequestUsers.push(sh['_id']);
      //   }
      //   if (this.stakeData[sh['offerRole']] == null) {
      //     this.stakeData[sh['offerRole']] = [];
      //   }
      //   this.stakeData[sh['offerRole']].push({name: sh['_id'], email: sh['email']});
      // })

      for (var prop in this.stakeData) {
        if (prop == 'Co-Owner' || prop == 'Owner') {
          this.stakeData[prop].forEach(holder => {
            canRequestUsers.push(holder['_id']);
          })
        }
      }

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

requestForApproval(){
  console.log(this.currentOfferId)
  console.log(this.ideate)
  this.exitCriteriaValidationService.requestApproval(this.currentOfferId).subscribe(data => {

  })
}

}