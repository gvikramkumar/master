import { Component, OnInit, Input } from '@angular/core';
import { OfferPhaseService } from '../services/offer-phase.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TurbotaxService } from '../services/turbotax.service';
import { MenuBarService } from '../services/menu-bar.service'
@Component({
    selector: 'app-turbotaxview',
    templateUrl: './turbotaxview.component.html',
    styleUrls: ['./turbotaxview.component.css']
})
export class TurbotaxviewComponent implements OnInit {
    @Input() data: string;
    public mStoneCntInAllPhases: any[] = ['ideate', 'plan', 'execute', 'launch'];
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

    constructor(private offerPhaseService: OfferPhaseService, private menuBarService: MenuBarService,
        private activatedRoute: ActivatedRoute, private turbotax: TurbotaxService, private router: Router) {
    }

    ngOnInit() {

        this.attribute = false;
        this.navigateHash['Offer Creation'] = ['/coolOffer', this.data['offerId'], this.data['caseId']];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', this.data['offerId'], this.data['caseId']];
        this.navigateHash['StakeHolder Identification'] = ['/stakeholderFull', this.data['offerId'], this.data['caseId']];
        this.navigateHash['Strategy Review'] = ['/strategyReview', this.data['offerId'], this.data['caseId']];

        this.navigateHash['Offer Dimension'] = ['/offerDimension', this.data['offerId'], this.data['caseId']];
        this.navigateHash['Offer Solutioning'] = ['/offerSolutioning', this.data['offerId'], this.data['caseId']];
        this.navigateHash['Offer Components'] = ['/offerConstruct', this.data['offerId'], this.data['caseId']];

        this.turbotax.getRubboTaxMenu(this.data['caseId']).subscribe(data => {
            this.offerPhaseDetailsList = data;
            console.log("turbotax view", this.offerPhaseDetailsList);
            this.ideateCount = data['ideate'].length;
            this.planCount = data['plan'].length;
            data['ideate'].forEach(element => {
                if (element.status === 'Completed') {
                    this.ideateCompletedCount = this.ideateCompletedCount + 1;
                }
            });

            data['plan'].forEach(element => {
                if (element.status === 'Completed') {
                    this.planCompletedCount = this.ideateCompletedCount + 1;
                }
            });
        })

        this.offerPhaseService.getCurrentOfferPhaseInfo(this.data['caseId']).subscribe(data => {
            this.processCurrentPhaseInfo(data);
        });
    }

    processCurrentPhaseInfo(phaseInfo) {
        this.mStoneCntInAllPhases.forEach(element => {
            const obj = {};
            let count = 0;
            const phase = phaseInfo[element];
            if (phase !== undefined) {
                phase.forEach(element => {
                    if (element.status === 'Completed') {
                        count = count + 1;
                    }
                });
                obj['phase'] = element;
                if (count > 0 && count < 4) {
                    obj['status'] = 'active';
                } else if (count === 4) {
                    obj['status'] = 'visited';
                } else if (count === 0) {
                    obj['status'] = '';
                }
            } else {
                obj['phase'] = element;
                obj['status'] = '';
            }
            this.mileStoneStatus.push(obj);
        });
        this.phaseProcessingCompleted = true;
    }

    gotobackTomilestone(value) {
        if (this.navigateHash[value] != null) {
            this.router.navigate(this.navigateHash[value]);
        }
    }
}
