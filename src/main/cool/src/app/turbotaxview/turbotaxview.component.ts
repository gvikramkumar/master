import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { OfferPhaseService } from '../services/offer-phase.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TurbotaxService } from '../services/turbotax.service';
import { MenuBarService } from '../services/menu-bar.service'
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
    public currentOfferId: any;
    public ideateCount: any = 0;
    public ideateCompletedCount = 0;
    public planCount = 0;
    public planCompletedCount = 0;

    public offerPhaseDetailsList: any;
    public phaseProcessingCompleted = false;
    checkout: { Message: string; items: { mainVO: { main_title: string; childVO: { title: string; price: string; }[]; discounts: { title: string; price: string; }[]; }; quantity: string; price: string; currency: string; }[]; };
    navigateHash: Object = {};

    attribute: boolean;

    constructor(
        private offerPhaseService: OfferPhaseService,
        private turbotax: TurbotaxService,
        private router: Router
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        const caseIdChange: SimpleChange = changes.caseId;
        const offerIdChange: SimpleChange = changes.offerId;

        const caseId = caseIdChange.currentValue;
        const offerId = offerIdChange.currentValue;

        this.attribute = false;
        this.navigateHash['Offer Creation'] = ['/coolOffer', offerId, caseId];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', offerId, caseId];
        this.navigateHash['StakeHolder Identification'] = ['/stakeholderFull', offerId, caseId];
        this.navigateHash['Strategy Review'] = ['/strategyReview', offerId, caseId];

        this.navigateHash['Offer Dimension'] = ['/offerDimension', offerId, caseId];
        this.navigateHash['Offer Solutioning'] = ['/offerSolutioning', offerId, caseId];
        this.navigateHash['Offer Components'] = ['/offerConstruct', offerId, caseId];

        this.turbotax.getRubboTaxMenu(caseId).subscribe(resOfferPhases => {
            if (resOfferPhases) {
                this.offerPhaseDetailsList = resOfferPhases;

                this.ideateCount = resOfferPhases.ideate ? resOfferPhases.ideate.length : 0;
                this.ideateCompletedCount = resOfferPhases.ideate ? resOfferPhases.ideate.filter(this.isMilestoneCompleted()).length : 0;

                this.planCount = resOfferPhases.plan ? resOfferPhases.plan.length : 0;
                this.planCompletedCount = resOfferPhases.plan ? resOfferPhases.plan.filter(this.isMilestoneCompleted()).length : 0;

                this.processCurrentPhaseInfo(resOfferPhases);
            }
        });

        // this.offerPhaseService.getCurrentOfferPhaseInfo(caseId).subscribe(data => {
        //     this.processCurrentPhaseInfo(data);
        // });
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
        this.phaseProcessingCompleted = true;
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
