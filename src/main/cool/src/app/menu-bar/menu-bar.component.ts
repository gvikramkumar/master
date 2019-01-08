import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { MenuBarService } from '../services/menu-bar.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

    @Input() caseId;
    @Output() updateMessage = new EventEmitter<string>();
    items: MenuItem[];
    showPopup: boolean = false;
    popupType: String = '';
    itemShow: Object = {};
    navigateHash: Object = {};
    currentOfferId: String = '';

    constructor(private menuBarService: MenuBarService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(params => {
            this.currentOfferId = params['id'];
        });
    }

    ngOnInit() {
        this.navigateHash['Offer Creation'] = ['/coolOffer', this.currentOfferId];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', this.currentOfferId, this.caseId];
        this.navigateHash['StakeHolder Identification'] = ['/stakeholderFull', this.currentOfferId, this.caseId];
        this.navigateHash['Strategy Review'] = ['/strategyReview', this.currentOfferId, this.caseId];

        this.menuBarService.getRubboTaxMenu(this.caseId).subscribe(data => {
            if (data != null) {
                if (data['ideate'] != null) {
                    data['ideate'].forEach(element => {
                        if (element['status'] == 'Completed' || element['status'] == 'In progress') {
                            this.itemShow[element['subMilestone']] = true;
                        }
                    });
                }
            }

        });

        this.items = [
            {
                label: 'Ideate',
                items: [{ label: 'Offer Creation' },
                { label: 'Offer Model Evaluation' },
                { label: 'StakeHolder Identification' },
                { label: 'Strategy Review' }
                ]
            },
            {
                label: 'Plan',
                items: [
                    { label: 'Offer Dimension Completion' },
                    { label: 'Offer Solutioning' },
                    { label: 'Offer Construct' },
                    { label: 'Offer Construct Details' },
                    { label: 'Design Review' }
                ]
            },
            {
                label: 'Execute',
                items: [
                    { label: 'Modular Workflow Completion' },
                    { label: 'PID & SKU Creation' },
                    { label: 'Offer Set Up and Design' },
                    { label: 'NPI Testing' },
                    { label: 'Readiness Review' }
                ]
            },
            {
                label: 'Launch',
                items: [
                    { label: 'Offer Launch' }
                ]
            },

        ]
    }

    showOppupFunc(ptype) {
        this.showPopup = true;
        this.popupType = ptype;
    }

    closePopup(message) {
        if (message != null && message !== '') {
            this.updateMessage.next(message);
        }
        this.showPopup = false;
    }

    navigate(name) {
        if (this.itemShow[name] === true) {
            if (this.navigateHash[name] != null) {
                this.router.navigate(this.navigateHash[name]);
            }
        }
    }
}



