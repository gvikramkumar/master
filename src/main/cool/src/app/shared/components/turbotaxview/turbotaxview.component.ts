import {Component, Input, OnChanges, SimpleChanges, SimpleChange, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { TurbotaxService } from '@shared/services';
import {UserService} from '@core/services';


@Component({
    selector: 'app-turbotaxview',
    templateUrl: './turbotaxview.component.html',
    styleUrls: ['./turbotaxview.component.css']
})
export class TurbotaxviewComponent implements OnChanges {

    @Input() caseId: string;
    @Input() offerId: string;

    public phases: any[] = ['ideate', 'plan', 'setup', 'launch'];
    public mileStoneStatus: any[] = [];

    public ideateCount: any = 0;
    public ideateCompletedCount = 0;
    public planCount = 0;
    public planCompletedCount = 0;
    public setupCount = 0;
    public setupCompleteCount = 0;
    public offerPhaseDetailsList = null;
    public phaseProcessingCompleted = false;
    public isOfferPhaseBlank = true;
    navigateHash: Object = {};
    listOfCompletedPhases: string[] = [];

    constructor(
        private turbotax: TurbotaxService,
        private router: Router,
        private _userService: UserService

    ) { }

    ngOnChanges(changes: SimpleChanges) {
        this.reset();

        const caseIdChange: SimpleChange = changes.caseId;
        const offerIdChange: SimpleChange = changes.offerId;

        const caseId = caseIdChange ? caseIdChange.currentValue : this.caseId;
        const offerId = offerIdChange ? offerIdChange.currentValue : this.offerId;
        this._userService.setofferId(offerId);

        this.navigateHash['Offer Creation'] = ['/coolOffer', offerId, caseId];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', offerId, caseId];
        this.navigateHash['Stakeholder Identification'] = ['/stakeholderFull', offerId, caseId];
        this.navigateHash['Strategy Review'] = ['/strategyReview', offerId, caseId];

        this.navigateHash['Offer Dimension'] = ['/offerDimension', offerId, caseId];
        this.navigateHash['Offer Solutioning'] = ['/offerSolutioning', offerId, caseId];
        this.navigateHash['Offer Components'] = ['/offerConstruct', offerId, caseId];
        this.navigateHash['Design Review'] = ['/designReview', offerId, caseId];
        this.navigateHash['Offer Setup Workflow'] = ['/offerSetup', offerId, caseId];

        this.turbotax.getRubboTaxMenu(caseId).subscribe(resOfferPhases => {
            if (resOfferPhases) {

                this.offerPhaseDetailsList = resOfferPhases;

                this.ideateCount = resOfferPhases.ideate ? resOfferPhases.ideate.length : 0;
                this.ideateCompletedCount = resOfferPhases.ideate ? resOfferPhases.ideate.filter(
                    this.isMilestoneCompletedAndNotApplicable()).length : 0;

                this.planCount = resOfferPhases.plan ? resOfferPhases.plan.length : 0;
                this.planCompletedCount = resOfferPhases.plan ? resOfferPhases.plan.filter(
                    this.isMilestoneCompletedAndNotApplicable()).length : 0;

                this.setupCount = resOfferPhases.setup ? resOfferPhases.setup.length : 0;
                this.setupCompleteCount = resOfferPhases.setup ? resOfferPhases.setup.filter(
                    this.isMilestoneCompletedAndNotApplicable()).length : 0;

                this.processCurrentPhaseInfo(resOfferPhases);
            }
            this.phaseProcessingCompleted = true;
            this.isOfferPhaseBlank = resOfferPhases === null || Object.keys(resOfferPhases).length === 0;
        });
    }

    processCurrentPhaseInfo(offerPhaseInfo) {
        debugger;
        this.mileStoneStatus = this.phases.reduce((accumulator, phase) => {
            const phaseInfo = {
                phase: phase,
                status: ''
            };
            const offerMilestone = offerPhaseInfo[phase];
            if (offerMilestone) {
            // This loop will executed for ideate phase.       
          offerMilestone.forEach(subMilestones => {
            if (subMilestones.subMilestone === 'Strategy Review') {
              if (subMilestones.status === 'Completed') {
                this.listOfCompletedPhases.push('Strategy Review');
                phaseInfo.status = 'visited';
              } else {
                phaseInfo.status = 'active';
              }
            }
          });
  
          // This loop will executed for plan phase.
          offerMilestone.forEach(subMilestones => {
            if (subMilestones.subMilestone === 'Design Review') {
              if (subMilestones.status === 'Completed') {
                this.listOfCompletedPhases.push('Design Review');
                phaseInfo.status = 'visited';
              } else {
                if (this.listOfCompletedPhases.includes('Strategy Review')) {
                  phaseInfo.status = 'active';
                } else {
                  phaseInfo.status = '';
                }
              }
            }
          });
  
          // This loop will executed for setup phase.
          offerMilestone.forEach(subMilestones => {
            if (subMilestones.subMilestone === 'Orderability') {
              if (subMilestones.status === 'Completed') {
                this.listOfCompletedPhases.push('Orderability');
                phaseInfo.status = 'visited';
              } else {
                if (this.listOfCompletedPhases.includes('Design Review')) {
                  phaseInfo.status = 'active';
                } else {
                  phaseInfo.status = '';
                }
              }
            }
          });
            }
            accumulator.push(phaseInfo);
            return accumulator;
        }, []);
    }

    reset() {
        this.mileStoneStatus = [];
        this.ideateCount = 0;
        this.ideateCompletedCount = 0;
        this.planCount = 0;
        this.planCompletedCount = 0;
        this.setupCount = 0;
        this.setupCompleteCount = 0;
        this.offerPhaseDetailsList = null;
        this.phaseProcessingCompleted = false;
        this.navigateHash = {};
        this.listOfCompletedPhases = [];
    }

    private isMilestoneNotTouched(): any {
        return milestone => milestone.status && (milestone.status.toLowerCase() === 'Available'
        || milestone.status.toLowerCase() === 'not applicable');
    }

    private isMilestoneActive(): any {
        return milestone => milestone.status && milestone.status.toLowerCase() === 'completed';
    }

    private isMilestoneVisited(): any {
        return milestone => milestone.status && (milestone.status.toLowerCase() === 'completed'
        || milestone.status.toLowerCase() === 'not applicable');
    }

    private isMilestoneCompletedAndNotApplicable(): any {
        return milestone => milestone.status && (milestone.status.toLowerCase() === 'completed'
        || milestone.status.toLowerCase() === 'not applicable');
    }

    gotobackTomilestone(value) {
        if (this.navigateHash[value] != null) {
            this.router.navigate(this.navigateHash[value]);
        }
    }

}
