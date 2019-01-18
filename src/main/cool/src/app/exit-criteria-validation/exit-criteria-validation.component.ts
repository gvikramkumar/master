import { Component, OnInit, Input } from '@angular/core';
import {ExitCriteriaValidationService} from '../services/exit-criteria-validation.service';
import {MonetizationModelService} from '../services/monetization-model.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HeaderService} from '../header/header.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-exit-criteria-validation',
  templateUrl: './exit-criteria-validation.component.html',
  styleUrls: ['./exit-criteria-validation.component.css'],
  providers: [HeaderService]
})

export class ExitCriteriaValidationComponent implements OnInit {
  @Input() stakeData:object;
  @Input() offerBuilderdata;
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
    private messageService: MessageService
    ) {
      this.activatedRoute.params.subscribe(params => {
        this.currentOfferId = params['id'];
        this.currentCaseId = params['id2'];
      });
     }

  ngOnInit() {
      this.exitCriteriaValidationService.getExitCriteriaData(this.currentCaseId).subscribe(data => {
      const canRequestUsers = [];
      this.exitCriteriaData=data;
      this.ideate = data['ideate'];

      for (let i = 0; i < this.ideate.length; i++) {
        if (this.ideate[i]['status'] !== 'Completed') {
          this.requestApprovalAvailable = false;
          break;
        }
      }
      for (let prop in this.stakeData) {
        if (prop === 'Co-Owner' || prop === 'Owner') {
          this.stakeData[prop].forEach(holder => {
            canRequestUsers.push(holder['_id']);
          });
        }
      }

      this.headerService.getCurrentUser().subscribe(user => {
        if (!canRequestUsers.includes(user)) {
          this.requestApprovalAvailable = false;
        }
      });
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


requestForApproval() {
  let payload = {};
  payload['offerName'] = this.offerBuilderdata['offerName'];
  payload['owner'] = this.offerBuilderdata['offerOwner'];
  this.exitCriteriaValidationService.requestApproval(this.currentOfferId).subscribe(data => {
    this.exitCriteriaValidationService.postForNewAction(this.currentOfferId, this.currentCaseId, payload).subscribe(response => {
      this.messageService.sendMessage('Strategy Review');
      this.requestApprovalAvailable = false;
    });

  });
}

}
