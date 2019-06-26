import { Component, OnInit, Input } from '@angular/core';
import { ExitCriteriaValidationService } from '@app/services/exit-criteria-validation.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderService, UserService, ConfigurationService } from '@app/core/services';
import { MessageService } from '@app/services/message.service';
import { OffersolutioningService } from '@app/services/offersolutioning.service';
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
  readOnly = false;
  requestApprovalAvailable: Boolean = false;
  approvedOfferId;

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private messageService: MessageService,
    private userService: UserService,
    private offersolutioningService: OffersolutioningService,
    private configurationService: ConfigurationService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.currentCaseId = params['caseId'];
    });
  }

  ngOnInit() {

    this.readOnly = this.configurationService.startupData.readOnly;
    const getOfferFlags = this.offersolutioningService.retrieveOfferFlags(this.currentOfferId);
    const getExitCriteria = this.exitCriteriaValidationService.getExitCriteriaData(this.currentOfferId)
    forkJoin([getOfferFlags, getExitCriteria]).subscribe(res => {

      const [offerFlags, exitCriteriaData] = res;

      this.ideate = exitCriteriaData['ideate'];

      const isRequestApprovalSent = offerFlags[STRATEGY_REVIEW_APPROVAL_SENT_FLAG];

      const ideateApprovalCriteria = this.ideate.slice(0, -1);
      const exitCriteriaMilestonesCompleted = ideateApprovalCriteria && ideateApprovalCriteria.every(milestone => milestone['status'] === 'Completed');

      const arrOwnersAndCoowners = [];
      let prop = this.configurationService.startupData.appRoleList
      if (prop.includes('Co-Owner') || prop.includes('Owner')) {
        let validUser = this.configurationService.startupData.userId
        arrOwnersAndCoowners.push(validUser);
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
        this.offersolutioningService.updateOfferFlag(this.currentOfferId, STRATEGY_REVIEW_APPROVAL_SENT_FLAG, true).subscribe();
        this.messageService.sendMessage('Strategy Review');
      });
    });
  }

}