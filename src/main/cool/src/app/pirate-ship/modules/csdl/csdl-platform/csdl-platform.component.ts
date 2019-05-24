import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { DashboardService } from '@shared/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';
import { CsdlPayload } from '../model/csdl-payload';
import { CsdlStatusTrackComponent } from '../csdl-status-track/csdl-status-track.component';
import { error } from 'util';

@Component({
  selector: 'app-csdl-platform',
  templateUrl: './csdl-platform.component.html',
  styleUrls: ['./csdl-platform.component.scss']
})
export class CsdlPlatformComponent implements OnInit {
  @ViewChild('refreshStatus', {read: ViewContainerRef}) vcr: ViewContainerRef;
  csdlForm: FormGroup;
  notRequiredCsdlForm: FormGroup;
  public currentOfferId: any;
  caseId: string;
  offerId: string;
  firstData: Object;
  public data = [];
  derivedMM;
  offerName;
  primaryBE: string;
  displayLeadTime = false;
  noOfWeeksDifference: string;
  stakeHolderInfo: any;
  message = {};
  stakeData = {};
  proceedButtonStatusValid = true;
  backbuttonStatusValid = true;
  pirateShipModuleName: string;
  isPirateShipSubModule: boolean;
  stakeHolders = {};
  csdlRequired: Boolean = false;
  csdlNotRequired: Boolean = false;
  displayNewCsdlIdDailog: Boolean = false;
  displayIdCreationDailog: Boolean = false;
  isCsdlRequired: Boolean = true;
  isCompleteButtonDisabled: Boolean = false;
  cols: any[];
  selectedAto: any;
  productFamilyAnswer;
  results;
  selectedProject;
  businessUnitContact;
  offerOwnerId;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stakeholderfullService: StakeholderfullService,
    private rightPanelService: RightPanelService,
    private dashboardService: DashboardService,
    private csdlIntegrationService: CsdlIntegrationService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
    });
    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = 'CSDL';
  }

  ngOnInit() {
    this.csdlForm = new FormGroup({
      csdlId: new FormControl(null, Validators.required)
    });

    this.notRequiredCsdlForm = new FormGroup({
      noCode: new FormControl('', Validators.required)
    });

    // load status tracking component in the below conditions.
    // 2. When csdlMileStone is in 'In progress'
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe((data) => {
      this.isCsdlRequired = false;
      if (data.csdlMileStoneStatus === 'In Progress') {
        this.showComponent();
      } else if (data.csdlMileStoneStatus === 'Complete') {
        // When user selected CDSL Not Required and pressed complete button.
      } else {
        this.isCsdlRequired = true;
      }
    },
    (error) => {
      this.isCsdlRequired = true;
    });

    this.dashboardService.getMyOffersList().subscribe(resOffers => {
      resOffers.forEach(ele => {
        this.stakeHolders[ele.offerId] = {};
        if (ele.stakeholders != null) {
          ele.stakeholders.forEach(holder => {
            if (this.stakeHolders[ele.offerId][holder.functionalRole] == null) {
              this.stakeHolders[ele.offerId][holder.functionalRole] = [];
            }
            this.stakeHolders[ele.offerId][holder.functionalRole].push(
              holder['_id']
            );
          });
        }
      });
    });

    this.stakeholderfullService
      .retrieveOfferDetails(this.currentOfferId)
      .subscribe(data => {
        this.firstData = data;
        this.offerId = this.currentOfferId;
        this.data = this.firstData['stakeholders'];
        this.derivedMM = this.firstData['derivedMM'];
        this.offerName = this.firstData['offerName'];
        this.businessUnitContact = this.firstData['ownerName'];
        this.offerOwnerId = this.firstData['offerOwner'];
        if (
          Array.isArray(this.firstData['primaryBEList']) &&
          this.firstData['primaryBEList'].length
        ) {
          this.primaryBE = this.firstData['primaryBEList'][0];
        }
        this.rightPanelService
          .displayAverageWeeks(this.primaryBE, this.derivedMM)
          .subscribe(
            leadTime => {
              this.noOfWeeksDifference = Number(
                leadTime['averageOverall']
              ).toFixed(1);
              this.displayLeadTime = true;
            },
            () => {
              this.noOfWeeksDifference = 'N/A';
            }
          );
        this.stakeHolderInfo = {};

        for (let i = 0; i <= this.data.length - 1; i++) {
          if (this.stakeHolderInfo[this.data[i]['offerRole']] == null) {
            this.stakeHolderInfo[this.data[i]['offerRole']] = [];
          }

          this.stakeHolderInfo[this.data[i]['offerRole']].push({
            userName: this.data[i]['name'],
            emailId: this.data[i]['_id'] + '@cisco.com',
            _id: this.data[i]['_id'],
            businessEntity: this.data[i]['businessEntity'],
            functionalRole: this.data[i]['functionalRole'],
            offerRole: this.data[i]['offerRole'],
            stakeholderDefaults: this.data[i]['stakeholderDefaults']
          });
        }
        this.stakeData = this.stakeHolderInfo;

        this.firstData['solutioningDetails'].forEach(element => {
          element.Details.forEach(ele => {
            if (ele.egenieAttributeName === 'Product Family') {
              this.productFamilyAnswer = ele.solutioningAnswer;
            }
          });
        });
      });
  }

  /**
   * When user click click here hyper link
   */
  onOpenCsdlTab() {
    let urlToOpen = 'https://csdl.cisco.com';
    window.open(urlToOpen, '_blank');
  }

  /**
   * When user select is Csdl Required 'Yes' radio button
   * @ param event
   */
  onCsdlRequired(event) {
    this.csdlRequired = true;
    this.csdlNotRequired = false;
  }

  /**
   * When user select is Csdl Required 'No' radio button 
   * @ param event
   */
  onCsdlNotRequired(event) {
    this.csdlNotRequired = true;
    this.csdlRequired = false;
  }

  /**
   * When user click on Create New Id and when user click submit button
   */
  submitCsdlAssociation() {
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.associationStatus = 'requested';
    csdlPayload.productFamily = this.productFamilyAnswer;
    csdlPayload.bUContact = this.offerOwnerId;
    csdlPayload.csdlMileStoneStatus = 'In Progress';
    this.createCsdlAssociation(csdlPayload);
    // Hide Panels
    this.displayNewCsdlIdDailog = false;
    this.displayIdCreationDailog = true;
  }

  createCsdlAssociation(csdlPayload) {
    this.csdlIntegrationService.createCsdlAssociation(csdlPayload).subscribe(data => {
      },
      err => {
        console.log(err);
      }
    );
  }

  onContinue() {
    this.isCsdlRequired = false;
    this.displayIdCreationDailog = false;
    this.showComponent();
  }

  showComponent() {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CsdlStatusTrackComponent);
    const component = this.vcr.createComponent(componentFactory);
  }

  /**
   * When user select is Csdl Not required 'No' radio button and upon clicking complete button
   */
  onComplete() {
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    // csdlPayload.offerName = this.offerName;
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.csdlRequired = 'N';
    csdlPayload.csdlMileStoneStatus = 'Complete';
    this.csdlIntegrationService.createCsdlAssociation(csdlPayload).subscribe(
      data => {
        this.isCompleteButtonDisabled = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  updateMessage(message) {
    if (message != null && message !== '') {
      if (message === 'hold') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: '',
          content:
            'The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black'
        };
      } else if (message === 'cancel') {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: '',
          content:
            'The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.',
          color: 'black'
        };
      }
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  createNewCsdlIdDailog() {
    this.displayNewCsdlIdDailog = true;
  }

  closeCreateNewCsdlIdDailog() {
    this.displayNewCsdlIdDailog = false;
    this.displayIdCreationDailog = false;
  }

  /**
   * Search CSDL Projects with CSDL Id or Project Name or Project Type
   * @param event
   */
  searchProjectNames(event) {
    const searchString = event.query;
    this.csdlIntegrationService.getAllProjects(searchString).subscribe(
      response => {
        this.results = response;
      },
      () => {}
    );
  }

  /**
   * Method called when user searches for CSDL ID or Project Name and submit button is clicked.
   * When user clicks on submit button, call post method to persist data into database and
   * redirects to status tracking page.
   */
  submitCoolToCsdl() {
    console.log(this.selectedProject);
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlProjectSelected = 'Y';
    csdlPayload.associationStatus = 'requested';
    csdlPayload.projectId = this.selectedProject.project_id;
    csdlPayload.projectType = this.selectedProject.project_type;
    csdlPayload.productFamily = this.productFamilyAnswer;
    csdlPayload.csdlMileStoneStatus = 'In Progress';
    // csdlPayload.bUContact = this.bUContact;
    this.createCsdlAssociation(csdlPayload);
    this.showComponent();
    // Hide Panels
    this.isCsdlRequired = false;
    this.displayIdCreationDailog = false;
  }

  /**
   * Refresh CSDL Project List when triggered manually.
   */
  refreshProjectList() {
    this.csdlIntegrationService
      .refreshProjects()
      .subscribe(response => {}, () => {});
  }
}
