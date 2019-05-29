import {Component, Input, OnChanges, SimpleChanges, SimpleChange, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { TurbotaxService } from '@shared/services';
import {HttpClient} from '@angular/common/http';
import {EnvironmentService} from '@env/environment.service';


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


    constructor(
        private turbotax: TurbotaxService,
        private router: Router,
        private httpClinet: HttpClient,
        private _envService: EnvironmentService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        this.reset();

        const caseIdChange: SimpleChange = changes.caseId;
        const offerIdChange: SimpleChange = changes.offerId;

        const caseId = caseIdChange ? caseIdChange.currentValue : this.caseId;
        const offerId = offerIdChange ? offerIdChange.currentValue : this.offerId;

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
              // var ToggleStatus  = {
              //   "offerId": offerId,
              //   "caseId": caseId,
              //   "offerDimension_toggleStatus": this.offerPhaseDetailsList.plan[0].status === 'Completed' ? true : false,
              //   "offerComponent_toggleStatus": this.offerPhaseDetailsList.plan[2].status === 'Completed' ? true : false,
              //   "offerSolutioning_toggleStatus": this.offerPhaseDetailsList.plan[1].status === 'Completed' ? true : false
              // };
              //
              // const url = `${this._envService.REST_API_UPDATE_MARK_COMPLETE_STATUS_URL}`;
              //
              // this.httpClinet.post(url, ToggleStatus).subscribe((response) => {
              // });


              this.ideateCount = resOfferPhases.ideate ? resOfferPhases.ideate.length : 0;
                this.ideateCompletedCount = resOfferPhases.ideate ? resOfferPhases.ideate.filter(this.isMilestoneCompleted()).length : 0;

                this.planCount = resOfferPhases.plan ? resOfferPhases.plan.length : 0;
                this.planCompletedCount = resOfferPhases.plan ? resOfferPhases.plan.filter(this.isMilestoneCompleted()).length : 0;

                this.setupCount = resOfferPhases.setup ? resOfferPhases.setup.length : 0;
                this.setupCompleteCount = resOfferPhases.setup ? resOfferPhases.setup.filter(this.isMilestoneCompleted()).length : 0;

                this.processCurrentPhaseInfo(resOfferPhases);
            }
            this.phaseProcessingCompleted = true;
            this.isOfferPhaseBlank = resOfferPhases === null || Object.keys(resOfferPhases).length === 0;
        });
    }

    processCurrentPhaseInfo(offerPhaseInfo) {
        this.mileStoneStatus = this.phases.reduce((accumulator, phase) => {
            const phaseInfo = {
                phase: phase,
                status: ''
            };
            const offerMilestone = offerPhaseInfo[phase];
            if (offerMilestone) {
                if (offerMilestone.every(this.isMilestoneCompleted())) {
                    phaseInfo.status = 'visited';
                } else if (offerMilestone.some(this.isMilestoneCompleted())) {
                    phaseInfo.status = 'active';
                }
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
    }

    private isMilestoneCompleted(): any {
        return milestone => milestone.status && milestone.status.toLowerCase() === 'completed';
    }

    gotobackTomilestone(value) {
        if (this.navigateHash[value] != null) {
            this.router.navigate(this.navigateHash[value]);
        }
    }

}
