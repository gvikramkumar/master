import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuBarService } from '@app/services/menu-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvironmentService } from '@env/environment.service';
import { UserService } from '@app/core/services';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

    @Input() caseId: string;
    @Input() offerId: string;
    @Input() offerName: string;
    @Input() stakeData: object;
    @Input() currentMMModel: string;

    @Input() showSave = false;
    @Output() onProceedToNext = new EventEmitter();
    @Output() updateMessage = new EventEmitter<string>();


    items: MenuItem[];
    showPopup: boolean;
    popupType: String = '';
    itemShow: Object = {};
    navigateHash: Object = {};
    currentOfferId: String = '';
    holdStatusValid = true;
    cancelStatusValid = true;
    currentUsername: any;

    constructor(private menuBarService: MenuBarService,
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private environmentService: EnvironmentService) {

        this.showPopup = false;

        this.activatedRoute.params.subscribe(params => {
            this.currentOfferId = params['offerId'];
            this.caseId = params['caseId'];
        });

        this.menuBarService.getRubboTaxMenu(this.caseId).subscribe(data => {
            if (data != null) {
                if (data['ideate'] != null) {
                    data['ideate'].forEach(element => {
                        if (element['enable'] === true) {
                            this.itemShow[element['subMilestone']] = true;
                        }
                    });
                    if (data['plan'] != null) {
                        data['plan'].forEach(element => {
                            if (element['enable'] === true) {
                                this.itemShow[element['subMilestone']] = true;
                            }
                        });
                    }
                    if (data['setup'] != null) {
                        data['setup'].forEach(element => {
                            if (element['enable'] === true) {
                                this.itemShow[element['subMilestone']] = true;
                            }
                        });
                    }
                }
            }

        });
        this.navigateHash['Offer Creation'] = ['/coolOffer', this.currentOfferId, this.caseId];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', this.currentOfferId, this.caseId];
        this.navigateHash['Stakeholder Identification'] = ['/stakeholderFull', this.currentOfferId, this.caseId];
        this.navigateHash['Strategy Review'] = ['/strategyReview', this.currentOfferId, this.caseId];
        this.navigateHash['Offer Dimension'] = ['/offerDimension', this.currentOfferId, this.caseId];
        this.navigateHash['Offer Solutioning'] = ['/offerSolutioning', this.currentOfferId, this.caseId];
        this.navigateHash['Offer Components'] = ['/offerConstruct', this.currentOfferId, this.caseId];
        this.navigateHash['Design Review'] = ['/designReview', this.currentOfferId, this.caseId];
        this.navigateHash['Offer Setup Workflow'] = ['/offerSetup', this.currentOfferId, this.caseId];
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Ideate',
                items: [{ label: 'Offer Creation' },
                { label: 'Offer Model Evaluation' },
                { label: 'Stakeholder Identification' },
                { label: 'Strategy Review' }
                ]
            },
            {
                label: 'Plan',
                items: [
                    { label: 'Offer Dimension' },
                    { label: 'Offer Solutioning' },
                    { label: 'Offer Components' },
                    { label: 'Operational Assessment' },
                    { label: 'Design Review' }
                ]
            },
            {
                label: 'Set Up',
                items: [
                    { label: 'Offer Setup Workflow' },
                    { label: 'Completion Index' },
                    { label: 'Final Operational Assessment' },
                    { label: 'Readiness Review' },
                    { label: 'Orderability' }
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
                textValue.href = this.environmentService.redirectUrl;


                let emailSubject = `${this.offerName} (${this.offerId}) has been on hold by ${this.userService.getUserId()}`;
                let emailBody = `Hello All,
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
                    this.router.navigate(['/dashboard']);
                });
            }

            if (message === 'cancel') {

                this.holdStatusValid = false;
                this.cancelStatusValid = false;
                this.currentUsername = this.userService.getName();

                let textValue = document.createElement('a');
                textValue.innerText = 'here';
                textValue.href = this.environmentService.redirectUrl;

                let emailSubject = `${this.offerName}(${this.offerId}) has been canceled by ${this.userService.getUserId()}`;
                let emailBody = `Hello All,
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
                    this.router.navigate(['/dashboard']);


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

    saveCurrentState() {
        this.onProceedToNext.emit('false');
    }

    gotoOfferviewDetails() {
        this.router.navigate(['/offerDetailView', this.offerId, this.caseId]);
    }

}



