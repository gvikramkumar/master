import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuBarService } from '@app/services/menu-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvironmentService } from '@env/environment.service';
import { UserService } from '@app/core/services';
import { MonetizationModelService } from '@app/services/monetization-model.service';

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
    @Output() getMarkCompleteStatus= new EventEmitter<boolean>();




    items: MenuItem[];
    showPopup: boolean;
    popupType: String = '';
    itemShow: Object = {};
    offerBuilderdata = {};
    navigateHash: Object = {};
    showMarkcompletePopup: boolean = false;
    showMarkcompleteToggle: boolean = false;
    currentURL: String;
    canUncheckComplete: boolean;
    shouldDisable: boolean = false;
    currentOfferId: String = '';
    holdStatusValid = true;
    cancelStatusValid = true;
    currentUsername: any;
    designReviewRequestApprovalStatus: boolean;
    markCompleteStatus:boolean;

    constructor(
        private router: Router,
        private userService: UserService,
        private menuBarService: MenuBarService,
        private activatedRoute: ActivatedRoute,     
        private environmentService: EnvironmentService,
        private monetizationModelService: MonetizationModelService) {
         
        this.currentURL = activatedRoute.snapshot['_routerState'].url;

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
        

        this.menuBarService.getRubboTaxMenu(this.caseId).subscribe(data => {
            if (this.currentURL.includes('offerDimension')) {
                debugger;
                this.markCompleteStatus = data['plan'][0]['status'];
                this.showMarkcompleteToggle = true;
            } else if(this.currentURL.includes('offerSolutioning')){
                this.markCompleteStatus = data['plan'][1]['status'];
                this.showMarkcompleteToggle = true;
            } else if (this.currentURL.includes('offerConstruct')){
                this.markCompleteStatus = data['plan'][2]['status'];
                this.showMarkcompleteToggle = true;
            }
            this.getMarkCompleteStatus.next(this.markCompleteStatus);
            this.getCanUncheckCompleteStatus();
         
         
        })

        this.monetizationModelService.retrieveOfferDetails(this.currentOfferId).subscribe(data => {
            this.offerBuilderdata = data;
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
                this.menuBarService.sendNotification(emailNotificationData).subscribe(res => {
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

    getCanUncheckCompleteStatus() {

        this.menuBarService.getDesignReviewStatus(this.offerId).subscribe(data => {
              this.designReviewRequestApprovalStatus = data['designReviewRequestApproval'];
              if (this.designReviewRequestApprovalStatus == true){
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

    closeMarkCompletePopup(message) {
        this.showMarkcompletePopup = false;
        this.markCompleteStatus = !this.markCompleteStatus;
        this.getMarkCompleteStatus.next(this.markCompleteStatus);
        this.disableMarkCompleteToggle();
    }

    confirmMarkComplete(message) {
        this.showMarkcompletePopup = false;
        this.getMarkCompleteStatus.next(this.markCompleteStatus);
        this.disableMarkCompleteToggle();
    }
    
    disableMarkCompleteToggle() {

        if(this.markCompleteStatus === false && this.canMarkComplete === false) {
           this.shouldDisable = true;
        }
         if(this.markCompleteStatus === true && this.canUncheckComplete === false) {
            this.shouldDisable = true;
         }
         console.log('111:'+ this.shouldDisable)
    }
}



