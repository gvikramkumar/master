import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { DashboardService } from '@shared/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';
import { CsdlPayload } from '../model/csdl-payload';
import { CsdlStatusTrackComponent } from '../csdl-status-track/csdl-status-track.component';
import { MessageService } from '@app/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-csdl-platform',
  templateUrl: './csdl-platform.component.html',
  styleUrls: ['./csdl-platform.component.scss']
})
export class CsdlPlatformComponent implements OnInit, OnDestroy {
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
  displayProjectType: Boolean = false;
  displayNewCsdl: Boolean = false;
  isCsdlRequired: Boolean = false;
  isCompleteButtonDisabled: Boolean = false;
  displayRestartModuleDailog: Boolean = false;
  displayNewCsdlIdDailog: Boolean = false;
  cols: any[];
  selectedAto: any;
  productFamilyAnswer;
  results;
  selectedProject;
  businessUnitContact;
  offerOwnerId;
  isLocked: Boolean = false;
  disableRestartModule: Boolean = true;
  mileStoneStatus;
  displayContinueInfo: Boolean = false;
  selectedDropValue: string = 'cloud';
  subscription: Subscription;
  components = [];
  bupmList = [];
  projectType;
  noCode;
  radioStatus = {
    noCode: false,
    noNewCode: false
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stakeholderfullService: StakeholderfullService,
    private rightPanelService: RightPanelService,
    private dashboardService: DashboardService,
    private csdlIntegrationService: CsdlIntegrationService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageService: MessageService
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
      noCode: new FormControl('noCode', Validators.required)
    });

    // load status tracking component in the below conditions.
    // 1. When csdlMileStone is in 'Complete'
    // 2. When csdlMileStone is in 'In progress'
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(data => {
      this.mileStoneStatus = data.csdlMileStoneStatus;
      if (data.csdlMileStoneStatus === 'Complete') {
        this.disableRestartModule = false;
        this.isCsdlRequired = false;
        this.csdlNotRequired = true;
      }

      if (data.csdlMileStoneStatus === 'In Progress') {
        this.navigateToStatusTrack();
      } else if (data.csdlMileStoneStatus === 'Complete' && data.stopShipStatus === '' && data.enforcementLabel === '') {
        // When user selected CDSL Not Required and pressed complete button.
        this.isLocked = true;
        this.isCsdlRequired = true;

        if (data.reasonForNotRequired === 'noCode') {
          this.radioStatus.noCode = true;
        }

        if (data.reasonForNotRequired === 'noNewCode') {
          this.radioStatus.noNewCode = true;
        }

      } else if (data.csdlMileStoneStatus === 'Complete') {
        if (data.stopShipStatus === 'True' && data.enforcementLabel === 'Enforced') {
        } else {
          this.navigateToStatusTrack();
        }
      } else {
        this.isCsdlRequired = true;
      }
    },
      () => {
        this.isCsdlRequired = true;
      });

    this.subscription = this.messageService.getMessage().subscribe(() => {
      this.afterDeAssociation();
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

        this.firstData['stakeholders'].forEach(element => {
          if (element['functionalRole'] === 'BUPM') {
            this.bupmList.push(element._id);
          }
        });
      });
  }

  /**
   * Navigating page from pirate ship page to status tracking page
   * Based on stopship status and enforcementlable values.
   */
  navigateToStatusTrack() {
    this.isCsdlRequired = false;
    this.showComponent();
  }

  /**
   * When user click click here hyper link
   */
  onOpenCsdlTab() {
    const urlToOpen = 'http://csdl.cisco.com';
    window.open(urlToOpen, '_blank');
  }

  /**
   * When user select is Csdl Required 'Yes' radio button
   * @ param event
   */
  onCsdlRequired() {
    this.csdlRequired = true;
    this.csdlNotRequired = false;
  }

  /**
   * When user select is Csdl Required 'No' radio button
   * @ param event
   */
  onCsdlNotRequired() {
    this.csdlNotRequired = true;
    this.csdlRequired = false;
  }

  /**
   * When user click on Create New Id and when user click submit button
   */
  nextCsdlAssociation() {
    this.projectType = this.selectedDropValue;
    // Hide Panels
    this.displayNewCsdl = true;
    this.displayProjectType = false;
    this.displayContinueInfo = false;
  }

  createCsdlAssociation(csdlPayload, isSearchItem) {
    this.csdlIntegrationService.createCsdlAssociation(csdlPayload).subscribe(() => {
      if(isSearchItem){
        this.showComponent();
      }
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * When user click on Continue button on p-dailogue.
   */
  onContinue() {
    this.displayNewCsdlIdDailog = false;
    this.isCsdlRequired = false;
    this.showComponent();
  }

  afterDeAssociation() {
    this.isCsdlRequired = true;
    this.csdlRequired = false;
    // Find the component
    const component = this.components.find((_component) => _component.instance instanceof CsdlStatusTrackComponent);
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.vcr.remove(this.vcr.indexOf(component));
      this.components.splice(componentIndex, 1);
    }
  }

  /**
   * Dynamically creating status stracking component and loading when it's required.
   */
  showComponent() {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CsdlStatusTrackComponent);
    const component = this.vcr.createComponent(componentFactory);
    // Push the component so that we can keep track of which components are created
    this.components.push(component);
  }

  /**
   * When user select is Csdl Not required 'No' radio button and upon clicking complete button
   */
  onComplete() {
    this.disableRestartModule = false;
      this.firstData['stakeholders'].forEach(ele => {
        if (ele['functionalRole'] === 'Security Compliance') {
            this.csdlIntegrationService.dashboardNotification(this.currentOfferId).subscribe(() => {
          });
        }
      });

    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(() => {
      this.existingComplete();
    }, (err) => {
      this.newComplete();
    }, () => {

    });
  }

  /**
   * When user select No and updating the existing document in the collection
   */
  existingComplete() {
    const csdlPayload = new CsdlPayload();
    const csdlPayloadArray: any = [];
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.csdlRequired = 'N';
    csdlPayload.csdlMileStoneStatus = 'Complete';
    csdlPayload.associationStatus = 'disassociate';
    csdlPayload.reasonForNotRequired = this.noCode;
    csdlPayload.stopShipStatus = '';
    csdlPayload.enforcementLabel = '';
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(() => {
      this.isCompleteButtonDisabled = true;
      this.isLocked = true;
    },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * When user select No and creating new document in the collection
   */
  newComplete() {
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.offerName = this.offerName;
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.csdlRequired = 'N';
    csdlPayload.csdlMileStoneStatus = 'Complete';
    csdlPayload.associationStatus = 'nan';
    csdlPayload.reasonForNotRequired = this.noCode;
    csdlPayload.projectId = null;
    this.csdlIntegrationService.createCsdlAssociation(csdlPayload).subscribe(
      () => {
        this.isCompleteButtonDisabled = true;
        this.isLocked = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  restartModule() {
    this.displayRestartModuleDailog = true;
  }

  /**
   * When user select No and restarting module updating the existing document in the collection
   */
  restartModuleConfirm() {
    this.isCsdlRequired = true;
    this.isLocked = false;
    this.csdlNotRequired = false;
    this.isCompleteButtonDisabled = false;
    this.displayRestartModuleDailog = false;
    this.disableRestartModule = true;
    const csdlPayloadArray: any = [];
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.csdlRequired = 'N';
    csdlPayload.csdlMileStoneStatus = 'Available';
    csdlPayload.associationStatus = 'nan';
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(
      () => {
        this.radioStatus.noCode = false;
        this.radioStatus.noNewCode = false;
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

  /**
   * When user click on Create New CSDL ID button on p-dailogue.
   */
  createNewCsdlIdDailog() {
    this.displayNewCsdlIdDailog = true;
    this.displayProjectType = true;
    this.displayNewCsdl = false;
    this.displayContinueInfo = false;
  }

  /**
   * Closing for Create CSDL ID p-dailogue.
   */
  closeCreateNewCsdlIdDailog() {
   this.displayNewCsdlIdDailog = false;
  }

  /**
   * When user click on submit button after the create new CSDL ID button p-dailogue .
   */
  submitCsdlToContinue() {
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(() => {
      this.existingCsdlSubmit();
    }, () => {
      this.newCsdlSubmit();
    }, () => {

    });
  }

  existingCsdlSubmit() {
    const csdlPayloadArray: any = [];
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.associationStatus = 'requested';
    csdlPayload.productFamily = this.productFamilyAnswer;
    csdlPayload.bUContact = this.bupmList;
    csdlPayload.offerManagerInformation = this.offerOwnerId;
    csdlPayload.csdlMileStoneStatus = 'In Progress';
    csdlPayload.projectType = this.selectedDropValue;
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(
      () => {
      },
      err => {
        console.log(err);
      }
    );
    this.displayContinueInfo = true;
    this.displayProjectType = false;
    this.displayNewCsdl = false;
  }

  newCsdlSubmit() {
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.associationStatus = 'requested';
    csdlPayload.productFamily = this.productFamilyAnswer;
    csdlPayload.bUContact = this.bupmList;
    csdlPayload.offerManagerInformation = this.offerOwnerId;
    csdlPayload.csdlMileStoneStatus = 'In Progress';
    csdlPayload.projectType = this.selectedDropValue;
    this.createCsdlAssociation(csdlPayload, false);
    this.displayContinueInfo = true;
    this.displayProjectType = false;
    this.displayNewCsdl = false;
  }

  /**
   * Clsocing restart module dailogue.
   */
  closeRestartModuleDailog() {
    this.displayRestartModuleDailog = false;
  }

  /**
   * Search CSDL Projects with CSDL Id or Project Name or Project Type
   * @param event search project name data
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
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(data => {
      this.existingSearchSubmit();
    }, () => {
      this.newSearchSubmit();
    }, () => {

    });
  }

  existingSearchSubmit() {
    const csdlPayloadArray: any = [];
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlProjectSelected = 'Y';
    csdlPayload.associationStatus = 'requested';
    csdlPayload.projectId = this.selectedProject.project_id;
    csdlPayload.projectType = this.selectedProject.project_type;
    csdlPayload.productFamily = this.productFamilyAnswer;
    csdlPayload.csdlMileStoneStatus = 'In Progress';
    csdlPayload.projectName = this.selectedProject.project_name;
    csdlPayload.bUContact = this.bupmList;
    csdlPayload.offerManagerInformation = this.offerOwnerId;
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(
      () => {
        this.showComponent();
        this.isCsdlRequired = false;
      },
      err => {
        console.log(err);
      }
    );
    this.csdlForm.reset();
  }

  newSearchSubmit() {
    const csdlPayload = new CsdlPayload();
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlProjectSelected = 'Y';
    csdlPayload.associationStatus = 'requested';
    csdlPayload.projectId = this.selectedProject.project_id;
    csdlPayload.projectType = this.selectedProject.project_type;
    csdlPayload.productFamily = this.productFamilyAnswer;
    csdlPayload.csdlMileStoneStatus = 'In Progress';
    csdlPayload.projectName = this.selectedProject.project_name;
    csdlPayload.bUContact = this.bupmList;
    csdlPayload.offerManagerInformation = this.offerOwnerId;
    this.createCsdlAssociation(csdlPayload, true);
    // Hide Panels
    this.isCsdlRequired = false;
    this.csdlForm.reset();
  }

  /**
   * Refresh CSDL Project List when triggered manually.
   */
  refreshProjectList() {
    this.csdlIntegrationService.refreshProjects().subscribe(
      () => {
        // success case
      },
      err => {
        // error case
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
