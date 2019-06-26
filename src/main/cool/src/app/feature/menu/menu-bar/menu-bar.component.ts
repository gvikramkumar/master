import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuBarService } from '@app/services/menu-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvironmentService } from '@env/environment.service';
import { UserService, LoaderService } from '@app/core/services';
import { Location } from '@angular/common';
import { AccessManagementService } from '@app/services/access-management.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { OfferDetailViewService } from '@app/services/offer-detail-view.service';
import { ConfigurationService } from '@app/core/services/configuration.service';

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
    @Input() canMarkComplete: boolean;
    @Input() showSave = false;
    @Output() onProceedToNext = new EventEmitter();
    @Output() updateMessage = new EventEmitter<string>();
    @Output() getMarkCompleteStatus = new EventEmitter<boolean>();

    currentURL: String;
    currentUsername: any;

    items: MenuItem[];
    showPopup: boolean;
    popupType: String = '';

    itemShow: Object = {};
    offerBuilderdata = {};
    navigateHash: Object = {};

    shouldDisable = false;
    holdStatusValid = true;
    public dispValue = false;
    cancelStatusValid = true;
    showMarkcompletePopup = false;
    showMarkcompleteToggle = false;

    markCompleteStatus: boolean;
    canUncheckComplete: boolean;
    designReviewRequestApprovalStatus: boolean;
    markCompleteVisible: Boolean = false;
    appRoleList;
    disableMessage: String;
    milestone: String;
    milestoneStatus: String;
    constructor(
        private router: Router,
        private _location: Location,
        private userService: UserService,
        private menuBarService: MenuBarService,
        private activatedRoute: ActivatedRoute,
        private environmentService: EnvironmentService,
        private accessMgmtService: AccessManagementService,
        private offerDetailViewService: OfferDetailViewService,
        private configurationService: ConfigurationService,
        private loaderService: LoaderService
    ) {

        this.showPopup = false;

        this.currentURL = activatedRoute.snapshot['_routerState'].url;

        this.activatedRoute.params.subscribe(params => {
            this.caseId = params['caseId'];
            this.offerId = params['offerId'];
        });

        this.menuBarService.getMilestoneDetails(this.offerId).subscribe(data => {
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

        this.navigateHash['Offer Creation'] = ['/coolOffer', this.offerId, this.caseId];
        this.navigateHash['Offer Model Evaluation'] = ['/mmassesment', this.offerId, this.caseId];
        this.navigateHash['Stakeholder Identification'] = ['/stakeholderFull', this.offerId, this.caseId];
        this.navigateHash['Strategy Review'] = ['/strategyReview', this.offerId, this.caseId];
        this.navigateHash['Offer Dimension'] = ['/offerDimension', this.offerId, this.caseId];
        this.navigateHash['Offer Solutioning'] = ['/offerSolutioning', this.offerId, this.caseId];
        this.navigateHash['Offer Components'] = ['/offerConstruct', this.offerId, this.caseId];
        this.navigateHash['Design Review'] = ['/designReview', this.offerId, this.caseId];
        this.navigateHash['Offer Setup Workflow'] = ['/offerSetup', this.offerId, this.caseId];
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

        this.appRoleList = this.configurationService.startupData.appRoleList;
        if (this.appRoleList.includes('Owner') || this.appRoleList.includes('Co-Owner')) {
            this.markCompleteVisible = true;
        }
        this.menuBarService.getMilestoneDetails(this.offerId).subscribe(data => {
            if (this.currentURL.includes('offerDimension')) {
                if(data['plan'][0]['status'] == 'Completed'){
                    this.markCompleteStatus = true;
                }else {
                    this.markCompleteStatus = false;
                }
                // this.markCompleteStatus = data['plan'][0]['status'];
                this.showMarkcompleteToggle = true;
            } else if (this.currentURL.includes('offerSolutioning')) {
                if(data['plan'][1]['status'] == 'Completed') {
                    this.markCompleteStatus = true;
                }else {
                    this.markCompleteStatus = false;
                }
                this.showMarkcompleteToggle = true;
            } else if (this.currentURL.includes('offerConstruct')) {
                if(data['plan'][2]['status'] == 'Completed') {
                    this.markCompleteStatus = true;
                }else {
                    this.markCompleteStatus = false;
                }
                this.showMarkcompleteToggle = true;
            }
            this.getMarkCompleteStatus.next(this.markCompleteStatus);
            this.getCanUncheckCompleteStatus();

        })

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

                const textValue = document.createElement('a');
                textValue.innerText = 'here';
                textValue.href = this.environmentService.redirectUrl;


                const emailSubject = `${this.offerName} (${this.offerId}) has been on hold by ${this.userService.getUserId()}`;
                const emailBody = `Hello All,
                ${this.offerName}(${this.offerId}) has been on hold by ${this.userService.getName()}.
                All related actions have been disabled.
                Click ${textValue.href} to view on hold offer in COOL.
                You are receiving this email because you have been identified as a stakeholder for ${this.offerName}.`;
                const stakeHolders = [];
                for (const prop in this.stakeData) {
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
                this.menuBarService.sendNotification(emailNotificationData).subscribe(() => {
                    this.router.navigate(['/dashboard']);
                });
            }

            if (message === 'cancel') {

                this.holdStatusValid = false;
                this.cancelStatusValid = false;
                this.currentUsername = this.userService.getName();

                const textValue = document.createElement('a');
                textValue.innerText = 'here';
                textValue.href = this.environmentService.redirectUrl;

                const emailSubject = `${this.offerName}(${this.offerId}) has been canceled by ${this.userService.getUserId()}`;
                const emailBody = `Hello All,
                ${this.offerName}(${this.offerId}) has been canceled by ${this.userService.getName()}.
                All related actions have been disabled.
                Click ${textValue} to view canceled offer in COOL.
                You are receiving this email because you have been identified as a stakeholder for ${this.offerName}.`;
                const stakeHolders = [];
                for (const prop in this.stakeData) {
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
                this.menuBarService.sendNotification(emailNotificationData).subscribe(() => {
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

    goBack() {
        this._location.back();
    }

    gotoOfferviewDetails() {
        this.router.navigate(['/offerDetailView', this.offerId, this.caseId]);
    }

    getCanUncheckCompleteStatus() {

        this.menuBarService.getDesignReviewStatus(this.offerId).subscribe(data => {
            this.designReviewRequestApprovalStatus = data['designReviewRequestApproval'];
            if (this.designReviewRequestApprovalStatus === true) {
                this.canUncheckComplete = false;
            } else {
                this.canUncheckComplete = true;
            }
            this.disableMarkCompleteToggle();
        })

    }

    toggleMarkCompletePopup() {
        this.showMarkcompletePopup = !this.showMarkcompletePopup;
    }

    closeMarkCompletePopup() {
        this.showMarkcompletePopup = false;
        this.markCompleteStatus = !this.markCompleteStatus;
        this.getMarkCompleteStatus.next(this.markCompleteStatus);
        //this.disableMarkCompleteToggle();
    }

    confirmMarkComplete() {
        if (this.canUncheckComplete === false) {
            this.showMarkcompletePopup = false;
            this.markCompleteStatus = !this.markCompleteStatus;
        } else {
            if (this.currentURL.includes('offerDimension')) {
                this.milestone = 'Offer Dimension';
            } else if (this.currentURL.includes('offerSolutioning')) {
                this.milestone = 'Offer Solutioning';
            } else if (this.currentURL.includes('offerConstruct')) {
                this.milestone = 'Offer Components';
            }
            if (this.markCompleteStatus == false) {
                this.milestoneStatus = 'Available';
            } else if (this.markCompleteStatus == true) {
                this.milestoneStatus = 'Completed';
            }
            this.showMarkcompletePopup = false;
            this.loaderService.startLoading();
            this.menuBarService.updateMarkCompleteStatus(this.offerId, this.milestone, this.milestoneStatus).subscribe((response) => {
                this.getMarkCompleteStatus.next(this.markCompleteStatus);
                this.onProceedToNext.emit('false');
                this.sendUpdatedMilestoneData(response);
                this.menuBarService.updateOfferPhaseWidget(response);
                this.loaderService.stopLoading();
            });
        }
    }

    sendUpdatedMilestoneData(data) {
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
    }
    disableMarkCompleteToggle() {
        if (this.canUncheckComplete === false) {
            this.shouldDisable = true;
            this.disableMessage = "As Design Review has been requested, Offer Builder has been locked for edits."
        }

    }
    showOfferInfo(event, overlaypanel: OverlayPanel) {

        this.offerDetailViewService.retrieveOfferDetails(this.offerId).subscribe(offerBuilderdata => {

            this.offerBuilderdata = offerBuilderdata;

            this.offerBuilderdata['BEList'] = [];
            this.offerBuilderdata['BUList'] = [];
            if (this.offerBuilderdata['primaryBEList'] != null) {
                this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['primaryBEList']);
            }
            if (this.offerBuilderdata['secondaryBEList'] != null) {
                this.offerBuilderdata['BEList'] = this.offerBuilderdata['BEList'].concat(this.offerBuilderdata['secondaryBEList']);
            }
            if (this.offerBuilderdata['primaryBUList'] != null) {
                this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['primaryBUList']);
            }
            if (this.offerBuilderdata['secondaryBUList'] != null) {
                this.offerBuilderdata['BUList'] = this.offerBuilderdata['BUList'].concat(this.offerBuilderdata['secondaryBUList']);
            }

        });

        overlaypanel.toggle(event);
    }

}



