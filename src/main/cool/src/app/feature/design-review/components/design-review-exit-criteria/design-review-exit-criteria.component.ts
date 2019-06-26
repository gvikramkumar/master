import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExitCriteriaValidationService } from 'src/app/services/exit-criteria-validation.service';
import { HeaderService, UserService, ConfigurationService } from '@app/core/services';
import { MessageService } from '@app/services/message.service';
import * as _ from 'lodash';
import { MonetizationModelService } from '@app/services/monetization-model.service';

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
  readOnly = false;

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private configurationService: ConfigurationService,
    private headerService: HeaderService,
    private messageService: MessageService,
    private userService: UserService,
    private monetizationModelService: MonetizationModelService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.currentCaseId = params['caseId'];
    });
  }

  ngOnInit() {
    this.readOnly = this.configurationService.startupData.readOnly;
  
    this.monetizationModelService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
      this.offerData = data;
      let offerDimensionSelected = true;
      let offerSolutioningSelected = true;
      let offerComponentsSelected = true;
      // Need to select atleast one subgroup characteristic from offer dimension to enable request approval button.
      this.offerData.additionalCharacteristics.forEach(element => {
        if (element.characteristics.length === 0) {
          offerDimensionSelected = false;
        }
      });
      // Need to give answer for every question from offer solutioning to enable request approval button.
      this.offerData.solutioningDetails.forEach(element => {
        element.Details.forEach(ele => {
          if (_.isEmpty(ele.solutioningAnswer)) {
            offerSolutioningSelected = false;
          }
        });
      });
       // Need to drag atlease one major and one minor items from offer component to enable request approval button.
      const majorArr = [];
      const minorArr = [];
      this.offerData.constructDetails.map( item => {
        if (item.constructItem === 'Major') {
          majorArr.push(item);
        } else {
          minorArr.push(item);
        }
      });
      if (majorArr.length === 0 && minorArr.length === 0) {
        offerComponentsSelected = false;
      }
      if (!offerDimensionSelected && !offerSolutioningSelected && !offerComponentsSelected) {
        this.requestApprovalAvailable = false;
      }
    });
    this.exitCriteriaValidationService.requestApprovalButtonEnable(this.currentOfferId).subscribe(data => {
      if (data['designReviewRequestApproval']) {
        this.requestApprovalAvailable = false;
      }
    });

    this.exitCriteriaValidationService.getExitCriteriaData(this.currentOfferId).subscribe(data => {
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

       let prop = this.configurationService.startupData.appRoleList;
        if (prop.includes('Co-Owner') || prop.includes('Owner')) {
          let validUser = this.configurationService.startupData.userId
            canRequestUsers.push(validUser);
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
    this.requestApprovalAvailable = false;
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
    this.exitCriteriaValidationService.designReviewRequestApproval(this.currentOfferId).subscribe(data => {
      this.exitCriteriaValidationService.postForDesingReviewNewAction(this.currentOfferId, this.currentCaseId, payload)
      .subscribe(response => {
        this.messageService.sendMessage('Design Review');
        this.exitCriteriaValidationService.requestApprovalButtonDisable(this.currentOfferId).subscribe(resData => {
        });
      });
    });
  }


}
