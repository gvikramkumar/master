import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { DashboardService } from '@shared/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';
import { CsdlPayload } from '../model/csdl-payload';

@Component({
  selector: "app-csdl-platform",
  templateUrl: "./csdl-platform.component.html",
  styleUrls: ["./csdl-platform.component.scss"]
})
export class CsdlPlatformComponent implements OnInit {
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
  refreshStatus: Boolean = false;
  isCompleteButtonDisabled: Boolean = true;
  cols: any[];
  selectedAto: any;
  productFamilyAnswer;
  csdlData = [
    {
      csdlId: "29385971",
      stopShip: "False",
      enforcement: "Hard",
      latestStatusUpdate: "05-Aug-2019 2:00pm"
    }
  ];
  results;
  selectedProject;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stakeholderfullService: StakeholderfullService,
    private rightPanelService: RightPanelService,
    private dashboardService: DashboardService,
    private csdlIntegrationService: CsdlIntegrationService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params["offerId"];
      this.caseId = params["caseId"];
      this.selectedAto = params["selectedAto"];
    });
    // Initialize TaskBar Params
    this.isPirateShipSubModule = true;
    this.pirateShipModuleName = "CSDL";
  }

  ngOnInit() {
    this.csdlForm = new FormGroup({
      csdlId: new FormControl(null, Validators.required)
    });

    this.notRequiredCsdlForm = new FormGroup({
      noCode: new FormControl("", Validators.required)
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
              holder["_id"]
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
        this.data = this.firstData["stakeholders"];
        this.derivedMM = this.firstData["derivedMM"];
        this.offerName = this.firstData["offerName"];
        if (
          Array.isArray(this.firstData["primaryBEList"]) &&
          this.firstData["primaryBEList"].length
        ) {
          this.primaryBE = this.firstData["primaryBEList"][0];
        }
        this.rightPanelService
          .displayAverageWeeks(this.primaryBE, this.derivedMM)
          .subscribe(
            leadTime => {
              this.noOfWeeksDifference = Number(
                leadTime["averageOverall"]
              ).toFixed(1);
              this.displayLeadTime = true;
            },
            () => {
              this.noOfWeeksDifference = "N/A";
            }
          );
        this.stakeHolderInfo = {};

        for (let i = 0; i <= this.data.length - 1; i++) {
          if (this.stakeHolderInfo[this.data[i]["offerRole"]] == null) {
            this.stakeHolderInfo[this.data[i]["offerRole"]] = [];
          }

          this.stakeHolderInfo[this.data[i]["offerRole"]].push({
            userName: this.data[i]["name"],
            emailId: this.data[i]["_id"] + "@cisco.com",
            _id: this.data[i]["_id"],
            businessEntity: this.data[i]["businessEntity"],
            functionalRole: this.data[i]["functionalRole"],
            offerRole: this.data[i]["offerRole"],
            stakeholderDefaults: this.data[i]["stakeholderDefaults"]
          });
        }
        this.stakeData = this.stakeHolderInfo;

        this.firstData["solutioningDetails"].forEach(element => {
          element.Details.forEach(ele => {
            if (ele.egenieAttributeName === "Product Family") {
              this.productFamilyAnswer = ele.solutioningAnswer;
            }
          });
        });
      });
  }

  onOpenCsdlTab() {
    let urlToOpen = "https://csdl.cisco.com";
    window.open(urlToOpen, "_blank");
  }

  onCsdlRequired(event) {
    this.csdlRequired = true;
    this.csdlNotRequired = false;
  }

  onCsdlNotRequired(event) {
    this.csdlNotRequired = true;
    this.csdlRequired = false;
  }

  submitCsdlAssociation() {
    this.displayNewCsdlIdDailog = false;
    this.displayIdCreationDailog = true;
    const csdlPayload = new CsdlPayload(
      this.currentOfferId,
      this.offerName,
      "Y",
      this.productFamilyAnswer,
      "John Smith",
      this.derivedMM,
      "N",
      "Test Offer Manager",
      null,
      null,
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    this.createCsdlAssociation(csdlPayload);
  }

  createCsdlAssociation(csdlPayload) {
    this.csdlIntegrationService.createCsdlAssociation(csdlPayload).subscribe(
      data => {},
      err => {
        console.log(err);
      }
    );
  }

  onContinue() {
    this.isCsdlRequired = false;
    this.refreshStatus = true;
    this.displayIdCreationDailog = false;
  }

  onComplete() {
    const csdlPayload = new CsdlPayload(
      this.currentOfferId,
      this.offerName,
      "Y",
      this.productFamilyAnswer,
      "John Smith",
      this.derivedMM,
      "N",
      "Test Offer Manager",
      null,
      null,
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    this.csdlIntegrationService.createCsdlAssociation(csdlPayload).subscribe(
      data => {
        this.isCompleteButtonDisabled = false;
      },
      err => {
        console.log(err);
        this.isCompleteButtonDisabled = false;
      }
    );
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  updateMessage(message) {
    if (message != null && message !== "") {
      if (message === "hold") {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: "",
          content:
            "The Offer has been placed on hold. All the stakeholders will be notified about the update status of the Offer.",
          color: "black"
        };
      } else if (message === "cancel") {
        this.proceedButtonStatusValid = false;
        this.backbuttonStatusValid = false;
        this.message = {
          contentHead: "",
          content:
            "The Offer has been cancelled. All the stakeholders will be notified about the update status of the Offer.",
          color: "black"
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
    const csdlPayload = new CsdlPayload(
      this.currentOfferId,
      this.offerName,
      "Y",
      this.productFamilyAnswer,
      "John Smith",
      this.derivedMM,
      "Y",
      "Test Offer Manager",
      null,
      null,
      "",
      "",
      "",
      "",
      "",
      "",
      ''
    );
    this.createCsdlAssociation(csdlPayload);
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
