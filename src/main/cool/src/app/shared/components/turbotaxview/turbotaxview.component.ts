import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router} from '@angular/router';
import { TurbotaxService } from '@shared/services';


@Component({
    selector: 'app-turbotaxview',
    templateUrl: './turbotaxview.component.html',
    styleUrls: ['./turbotaxview.component.css']
})
export class TurbotaxviewComponent implements OnChanges {

    @Input() caseId: string;
    @Input() offerId: string;

    public phases: any[] = ['ideate', 'plan', 'execute', 'launch'];
    public mileStoneStatus: any[] = [];

    public ideateCount: any = 0;
    public ideateCompletedCount = 0;
    public planCount = 0;
    public planCompletedCount = 0;
    public executeCount = 0;
    public executeCompleteCount = 0;
    public offerPhaseDetailsList = null;
    public phaseProcessingCompleted = false;
    public isOfferPhaseBlank = true;
    navigateHash: Object = {};


    constructor(
        private turbotax: TurbotaxService,
        private router: Router
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
        this.navigateHash['Modular Workflow Completion'] = ['/offerSetup', offerId, caseId];
        this.turbotax.getRubboTaxMenu(caseId).subscribe(resOfferPhases => {
            if (resOfferPhases) {
                console.log('response offer phases '+JSON.stringify(resOfferPhases));
                this.offerPhaseDetailsList = resOfferPhases;

                this.ideateCount = resOfferPhases.ideate ? resOfferPhases.ideate.length : 0;
                this.ideateCompletedCount = resOfferPhases.ideate ? resOfferPhases.ideate.filter(this.isMilestoneCompleted()).length : 0;

                this.planCount = resOfferPhases.plan ? resOfferPhases.plan.length : 0;
                this.planCompletedCount = resOfferPhases.plan ? resOfferPhases.plan.filter(this.isMilestoneCompleted()).length : 0;

                this.executeCount = resOfferPhases.execute ? resOfferPhases.execute.length : 0;
                this.executeCompleteCount = resOfferPhases.execute ? resOfferPhases.execute.filter(this.isMilestoneCompleted()).length : 0;
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
