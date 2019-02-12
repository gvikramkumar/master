import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuBarService } from '../services/menu-bar.service';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';



@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

    @Input() caseId: string;
    @Input() currentMMModel: string;
    @Input() offerId: string;
    @Input() offerName: string;
    @Input() stakeData: object;
    @Output() updateMessage = new EventEmitter<string>();
    items: MenuItem[];
    showPopup = false;
    popupType: String = '';
    itemShow: Object = {};
    navigateHash: Object = {};
    currentOfferId: String = '';
    holdStatusValid = true;
    cancelStatusValid = true;
    currentUsername: any;
    currentOfferName;

    constructor(private menuBarService: MenuBarService,
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private localStorage: LocalStorageService) {
        this.activatedRoute.params.subscribe(params => {
            this.currentOfferId = params['id'];
            this.caseId = params['id2'];
        });

        this.menuBarService.getRubboTaxMenu(this.caseId).subscribe(data => {
            if (data != null) {
                if (data['ideate'] != null) {
                    data['ideate'].forEach(element => {
                        if (element['status'] === 'Completed' || element['status'] === 'In progress') {
                            this.itemShow[element['subMilestone']] = true;
                        }
                    });
                }
            }

        });
    }

    ngOnInit() {
        this.currentOfferName = this.localStorage.retrieve('currentOfferName');
        this.navigateHash['Offer Creation'] = ['/coolOffer', this.currentOfferId, this.caseId];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', this.currentOfferId, this.caseId];
        this.navigateHash['StakeHolder Identification'] = ['/stakeholderFull', this.currentOfferId, this.caseId];
        this.navigateHash['Strategy Review'] = ['/strategyReview', this.currentOfferId, this.caseId];



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

        ];
    }

    showOppupFunc(ptype) {
        if ((ptype === 'hold' && this.holdStatusValid === true) || (ptype === 'cancel' && this.cancelStatusValid === true)) {
            this.showPopup = true;
            this.popupType = ptype;
        }
    }

    closePopup(message) {
        if (message != null && message !== '') {
            let emailNotificationData = {};
            if (message === 'hold') {
                this.holdStatusValid = false;
                this.cancelStatusValid = false;
                this.currentUsername = this.userService.getName();

                let textValue = document.createElement('a');
                textValue.innerText = 'here';
                textValue.href = 'cool/#/offerDetailView/' + this.offerId + '/' + this.caseId;


                let emailSubject = `${this.offerName} (${this.offerId}) has been on hold by ${this.userService.getUserId()}`;
                let emailBody = `Hello ${this.currentUsername},
                ${this.offerName}(${this.offerId}) has been on hold by ${this.userService.getName()}.
                All related actions have been disabled.
                Click ${textValue.href} to view on hold offer in COOL.
                You are receiving this email because you have been identified as a stakeholder for ${this.offerName}.`;
                let stakeHolders = [];
                for (let prop in this.stakeData) {
                    this.stakeData[prop].forEach(stakeholder => {
                        if (stakeholder['emailId'] != null) {
                            stakeHolders.push(stakeholder['emailId']);
                        } else if (stakeholder['email'] != null) {
                            stakeHolders.push(stakeholder['email']);
                        }
                    });
                }
                emailNotificationData = {
                    'subject': emailSubject,
                    'emailBody': emailBody,
                    'toMailLists': stakeHolders,
                };
                this.menuBarService.sendNotification(emailNotificationData).subscribe(res => {
                });
            }
            if (message === 'cancel') {
                this.holdStatusValid = false;
                this.cancelStatusValid = false;
                this.currentUsername = this.userService.getName();

                let textValue = document.createElement('a');
                textValue.innerText = 'here';
                textValue.href = 'cool/#/offerDetailView/' + this.offerId + '/' + this.caseId;

                let emailSubject = `${this.offerName}(${this.offerId}) has been canceled by ${this.userService.getUserId()}`;
                let emailBody = `Hello ${this.currentUsername},
                ${this.offerName}(${this.offerId}) has been canceled by ${this.userService.getName()}.
                All related actions have been disabled.
                Click ${textValue} to view canceled offer in COOL.
                You are receiving this email because you have been identified as a stakeholder for ${this.offerName}.`;
                let stakeHolders = [];
                for (let prop in this.stakeData) {
                    this.stakeData[prop].forEach(stakeholder => {
                        if (stakeholder['emailId'] != null) {
                            stakeHolders.push(stakeholder['emailId']);
                        } else if (stakeholder['email'] != null) {
                            stakeHolders.push(stakeholder['email']);
                        }
                    });
                }
                emailNotificationData = {
                    'subject': emailSubject,
                    'emailBody': emailBody,
                    'toMailLists': stakeHolders,
                };
                this.menuBarService.sendNotification(emailNotificationData).subscribe(res => {


                });
            }
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



