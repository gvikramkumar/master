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
    @Input() caseId: string

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


    constructor(private offerPhaseService: OfferPhaseService, private menuBarService: MenuBarService,
        private activatedRoute: ActivatedRoute, private turbotax: TurbotaxService) {
    }

    ngOnInit() {
        this.menuBarService.getRubboTaxMenu(this.caseId).subscribe(data => {
            this.offerPhaseDetailsList = data;
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

        this.offerPhaseService.getCurrentOfferPhaseInfo(this.caseId).subscribe(data => {
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
}
