import { Component, OnInit, Input } from '@angular/core';
import { ExitCriteriaValidationService } from '@app/services/exit-criteria-validation.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@app/header/header.service';
import { MessageService } from '@app/services/message.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UserService } from '@app/services/user.service';
import { OfferService } from '@app/services/offer.service';
import { forkJoin } from 'rxjs';

const STRATEGY_REVIEW_APPROVAL_SENT_FLAG = 'strategyReviewRequestApproval';
@Component({
  selector: 'app-exit-criteria-validation',
  templateUrl: './exit-criteria-validation.component.html',
  styleUrls: ['./exit-criteria-validation.component.css'],
  providers: [HeaderService]
})

export class ExitCriteriaValidationComponent implements OnInit {
  @Input() stakeData: object;
  @Input() offerBuilderdata;
  currentOfferId;
  currentCaseId;
  exitCriteriaData;
  ideate = [];
  offerOwner: String = '';
  requestApprovalAvailable: Boolean = false;
  approvedOfferId;

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private headerService: HeaderService,
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private offerService: OfferService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.currentCaseId = params['id2'];
    });
  }

  ngOnInit() {


    const getOfferFlags = this.offerService.retrieveOfferFlags(this.currentOfferId);
    const getExitCriteria = this.exitCriteriaValidationService.getExitCriteriaData(this.currentCaseId)
    forkJoin([getOfferFlags, getExitCriteria]).subscribe(res => {

      const [offerFlags, exitCriteriaData] = res;

      this.ideate = exitCriteriaData['ideate'];

      const isRequestApprovalSent = offerFlags[STRATEGY_REVIEW_APPROVAL_SENT_FLAG];

      const ideateApprovalCriteria = this.ideate.slice(0, -1);
      const exitCriteriaMilestonesCompleted = ideateApprovalCriteria && ideateApprovalCriteria.every(milestone => milestone['status'] === 'Completed');

      const arrOwnersAndCoowners = [];
      for (const prop in this.stakeData) {
        if (prop === 'Co-Owner' || prop === 'Owner') {
          this.stakeData[prop].forEach(holder => {
            arrOwnersAndCoowners.push(holder['_id']);
          });
        }
      }

      const currentUserIsOwnerOrCoowner = arrOwnersAndCoowners.includes(this.userService.getUserId());

      // Request approval button should show up only if
      // Request approval was never sent (request approval status is false)
      // Current user is the owner of the offer
      // All of the status in the ideate phase is not completed
      this.requestApprovalAvailable = !isRequestApprovalSent && exitCriteriaMilestonesCompleted && currentUserIsOwnerOrCoowner;

    });

  }

  actionStatusColor(status) {
    if (status.toLowerCase() === 'completed') {
      return 'GREEN';
    } else if (status.toLowerCase() === 'pending') {
      return 'RED';
    } else {
      return 'grey';
    }
  }

  requestForApproval() {
    // Once Request for approval is clicked
    // Disable the button
    this.requestApprovalAvailable = false;

    const payload = {};
    payload['offerName'] = this.offerBuilderdata['offerName'];
    payload['owner'] = this.offerBuilderdata['offerOwner'];
    const userId = this.userService.getUserId();
    this.exitCriteriaValidationService.updateOwbController(this.currentOfferId, userId).subscribe();

    // Create actions and notifications for stakeholders
    this.exitCriteriaValidationService.requestApproval(this.currentOfferId).subscribe(data => {
      this.exitCriteriaValidationService.postForNewAction(this.currentOfferId, this.currentCaseId, payload).subscribe(response => {
        // Update request approval flag to true
        this.offerService.updateOfferFlag(this.currentOfferId, STRATEGY_REVIEW_APPROVAL_SENT_FLAG, true).subscribe();
        this.messageService.sendMessage('Strategy Review');
      });
    });
  }

}
