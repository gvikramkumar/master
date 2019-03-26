import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExitCriteriaValidationService } from 'src/app/services/exit-criteria-validation.service';
import { HeaderService, UserService } from '@shared/services';
import { MessageService } from '@app/services/message.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-design-review-exit-criteria',
  templateUrl: './design-review-exit-criteria.component.html',
  styleUrls: ['./design-review-exit-criteria.component.css'],
  providers: [HeaderService]
})
export class DesignReviewExitCriteriaComponent implements OnInit {
  @Input() stakeData: object;
  @Input() offerBuilderdata;
  currentOfferId;
  currentCaseId;
  exitCriteriaData;
  ideate = [];
  plan = [];
  offerOwner: String = '';
  requestApprovalAvailable: Boolean = true;
  designApprovedOfferId;
  offerData;

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private headerService: HeaderService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.currentCaseId = params['id2'];
    });
  }

  ngOnInit() {
    this.exitCriteriaValidationService.requestApprovalButtonEnable(this.currentOfferId).subscribe(data => {
      if (data['designReviewRequestApproval']) {
        this.requestApprovalAvailable = false;
      }
    });

    this.exitCriteriaValidationService.getExitCriteriaData(this.currentCaseId).subscribe(data => {
      const canRequestUsers = [];
      this.exitCriteriaData = data;
      this.ideate = data['ideate'][3];
      this.plan = data['plan'];

      for (let i = 0; i < this.ideate.length-1; i++) {
        if (this.ideate[i]['status'] !== 'Completed') {
          this.requestApprovalAvailable = false;
          break;
        }
      }

      for (let i = 0; i < this.plan.length-1; i++) {
        if (this.plan[i]['status'] !== 'Completed' && this.plan[i]['status'] !== 'Not Applicable') {
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
    if (status === 'Completed') {
      return 'GREEN';
    } else if (status === 'Not Applicable') {
      return 'GREEN';
    } else if (status === 'pending') {
      return 'RED';
    } else {
      return 'grey';
    }
  }

  requestForApproval() {
    const payload = {};
    payload['offerName'] = this.offerBuilderdata['offerName'];
    payload['owner'] = this.offerBuilderdata['offerOwner'];
    const userId = this.userService.getUserId();
    this.exitCriteriaValidationService.updateOwbController(this.currentOfferId, userId).subscribe(data => {
      console.log(data);
    },
      error => {
        console.log('error occured');
      });
    this.exitCriteriaValidationService.requestApproval(this.currentOfferId).subscribe(data => {
      this.exitCriteriaValidationService.postForDesingReviewNewAction(this.currentOfferId, this.currentCaseId, payload)
      .subscribe(response => {
        this.messageService.sendMessage('Design Review');
        this.exitCriteriaValidationService.requestApprovalButtonDisable(this.currentOfferId).subscribe(resData => {
          this.requestApprovalAvailable = false;
        });
      });
    });
  }

}
