import { Component, OnInit } from '@angular/core';
import { comment } from './comment';
import { Subscription } from 'rxjs';
import { SharedataService } from './sharedata.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangestatusService } from './changestatus.service';
import { HeaderService } from '@app/core/services/header.service';
import { PirateShipSharedService } from '@app/services/pirate-ship-shared.service';
import { OfferSetupService } from '@app/services/offer-setup.service';
import { RightPanelService } from '@app/services/right-panel.service';
import { StakeholderfullService } from '@app/services/stakeholderfull.service';


@Component({
  selector: 'app-changestatus',
  templateUrl: './changestatus.component.html',
  styleUrls: ['./changestatus.component.css']
})

export class ChangestatusComponent implements OnInit {
  subscription: Subscription
  cmnt: comment;
  moduleObj: any;
  data: any;

  offerId: string;
  moduleName: string;
  caseId: string;
  selectedAto: string;
  comments: any[];
  userId: any;
  moduleOfStatus: any;

  derivedMM;
  moduleStatus;
  functionalRole;

  primaryBE: string;
  stakeHolderInfo: any;
  offerBuilderdata = {};
  displayLeadTime = false;
  noOfWeeksDifference: string;
  offerName;
  infohelp: string;
  stakeholders: any;
  stakeHolderData = [];
  showMM: boolean = false;

  groupData = {};
  showGroupData:boolean = false;
  Options: any[] = [];
  isReadOnly: boolean = true;

  ishide: boolean = true;
  isBtnNeeded: boolean = false;
  mStatus: any;

  basicmodule_hint = {
    "Pricing_Uplift_Setup": "BUPM has completed their Offer's Pricing Uplift activities in OWB Pricing Canvas",
    "Test_Orderability": "<ol><li>NPPM must create a test order in CCW to ensure all aspects of the ordering process are functioning properly and there are no gaps or issues.</li><li>BUPM and Offer Lead should meet with the NPPM to complete the ordering process in CCW and confirm all ordering rules are correct.</li><li>After the order is created, Offer Lead should track the order to ensure the order closes as expected and flows to SBP properly without any system issues.</li></ol>",
    "Offer_Attribution": "<ol><li>BUPM must get the proposed OA split approved by Global Revenue and the OA Board. The BUPM, BUC, and TSPM must be engaged in this conversation.</li><li>The BUPM must create the OA child PID(s) in eGenie (PID type is SW Subscription Mapped SKU) to dictate where the revenue will be routed.</li><li>Create an OA child PID for each group that is receiving revenue (i.e. a PID for the BU and a PID for SOA).  It is possible to leverage existing OA child PIDs if the revenue is being routed to the same team</li><li>The BU Controller must approve these PIDs before moving on to the next step</li><li>Once the OA child PIDs are approved in eGenie, BUPM or Offer Lead must complete the OA Mapping Template (PDT can download latest version of template in eGenie</li><li>BUPM must submit completed template to PDT by opening an NPI Workspace Case.</li><li>PDT will complete the OA setup and will reach out to Global Revenue to approve</li><li> Once Global Revenue has approved, the Offer Lead can click the \"Mark as Complete\" button.</li></ol>",
    "NPI_Licensing": "SW Licensing Stakeholder ensures that NPI licensing activities are complete ",
    "Royalty_Setup": "<ol><li>BUPM must engage with the NPPM to fill out the Royalty Configuration Template. BUPM can provide either a reference PID from a past offer that has the same royalties or provide attributes related to the supplier and product.</li><li>The NPPM will work with the Royalty team to complete the royalty setup. Once complete, the BUPM can validate the PID royalty setup using the Royalty Rate Master Report (RRM).</li></ol>",
    "Export Compliance": "<ol><li>BUPMs must complete the <a href=\"https://pepd.cloudapps.cisco.com/legal/export/pepd/EPReviewForm.do?method=showEPRForm#!/\" target=\"_blank\">Export Product Review Form: </a> </li><li>Once the BUPM has completed the form, they will receive an email notification with the results, as well as an EPR number.</li><li>Offer Leads or BUPMs should document the case number as it may be required for creation of new PIDs.</li><li>Offer Leads or BUPMs should reach out to the GET Team to schedule a due diligence review. The following three points are important to note before the due diligence review:<br/>a. The BUPM will need to explain the correlation between PID and the product the customer receives.<br/> b. Any SW associated with the SBP offering needs an export compliance due diligence review.<br/>  c. If the SW requires a formal US government review, the formal government review may potentially take up to 2-3 months.</li><li>Once the compliance due diligence review is complete, an email will be sent from the GET Team (exportclass@cisco.com) stating the PIDs are compliant.</li><li>If emails need to be sent to the GET Team (exportclass@cisco.com) requesting confirmation that export compliance due diligence is complete, please be sure to reference the EPR # in the subject line of the email.</li></ol>"
  };




  constructor(private sharedataService: SharedataService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private changestatusService: ChangestatusService,
              private headerService: HeaderService,
              private pirateShipSharedService:PirateShipSharedService,
              private offerSetupService: OfferSetupService,
              private rightPanelService: RightPanelService,
              private stakeholderfullService: StakeholderfullService,
  ) {

    this.activatedRoute.params.subscribe(params => {
      console.log('OfferID: ',params['offerId']);
      console.log('ModuleName: ', params['moduleName']);
      this.offerId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
      this.moduleName = params['moduleName'];
    });
    this.changestatusService.getModuleStatus(this.offerId, this.caseId, this.moduleName).subscribe(statusObj => {
      this.mStatus = statusObj;
      console.log('mStatus : ', this.mStatus);
    });
    this.cmnt = new comment();
    this.cmnt.description = '';
    this.findFunctionRoles(this.moduleName, pirateShipSharedService);
  }

  ngOnInit() {

    this.changestatusService.getAllComments(this.moduleName, this.offerId).subscribe(data=>{
      this.comments = data;
    });

    this.getOfferDetails();

  }

  findFunctionRoles(moduleName: string, pirateShipSharedService: PirateShipSharedService) {
    console.log('pirateShipSharedService : ', pirateShipSharedService.getRole());
    switch (moduleName) {
      case 'NPI Licensing': {
        this.infohelp = this.basicmodule_hint.NPI_Licensing;
        if ( pirateShipSharedService &&
          pirateShipSharedService.getRole()
          &&
          pirateShipSharedService.getRole() === 'SW Licensing') {

          this.isReadOnly = false;
        }
        break;
      }
      case 'Royalty Setup': {
        this.infohelp = this.basicmodule_hint.Royalty_Setup;
        if ( pirateShipSharedService &&
          pirateShipSharedService.getRole()
          &&
          (
            pirateShipSharedService.getRole() === 'Business Unit Product Manager (Business Unit Product Manager (BUPM))'
            ||
            pirateShipSharedService.getRole() === 'OLE'
            ||
            pirateShipSharedService.getRole() === 'SOE'
            ||
            pirateShipSharedService.getRole() === 'NPPM'
            ||
            pirateShipSharedService.getRole() === 'PDT'
          )) {
          this.isReadOnly = false;
        }
        break;
      }
      case 'Offer Attribution': {
        this.infohelp = this.basicmodule_hint.Offer_Attribution;
        if ( pirateShipSharedService &&
          pirateShipSharedService.getRole()
          &&
          (
            pirateShipSharedService.getRole() === 'Business Unit Product Manager (BUPM)'
            ||
            pirateShipSharedService.getRole() === 'OLE'
            ||
            pirateShipSharedService.getRole() === 'SOE'
            ||
            pirateShipSharedService.getRole() === 'NPPM'
            ||
            pirateShipSharedService.getRole() === 'PDT'
          )) {
          this.isReadOnly = false;
        }
        break;
      }
      case 'Export Compliance': {
        this.infohelp = this.basicmodule_hint['Export Compliance'];
        if ( pirateShipSharedService &&
          pirateShipSharedService.getRole()
          &&
          (
            pirateShipSharedService.getRole() === 'Business Unit Product Manager (BUPM)'
            ||
            pirateShipSharedService.getRole() === 'OLE'
            ||
            pirateShipSharedService.getRole() === 'SOE'
            ||
            pirateShipSharedService.getRole() === 'NPPM'
            ||
            pirateShipSharedService.getRole() === 'PDT'
            ||
            pirateShipSharedService.getRole() === 'Legal'
          )) {
          this.isReadOnly = false;
        }
        break;
      }
      case 'Test Orderability': {
        this.infohelp = this.basicmodule_hint.Test_Orderability;
        if ( pirateShipSharedService &&
          pirateShipSharedService.getRole()
          &&
          (
            pirateShipSharedService.getRole() === 'Business Unit Product Manager (BUPM)'
            ||
            pirateShipSharedService.getRole() === 'OLE'
            ||
            pirateShipSharedService.getRole() === 'SOE'
            ||
            pirateShipSharedService.getRole() === 'NPPM'
            ||
            pirateShipSharedService.getRole() === 'PDT'
          )) {
          this.isReadOnly = false;
        }
        break;
      }
      case 'Pricing Uplift Setup': {
        this.infohelp = this.basicmodule_hint.Pricing_Uplift_Setup;
        if ( pirateShipSharedService &&
          pirateShipSharedService.getRole()
          &&
          (pirateShipSharedService.getRole() === 'Business Unit Product Manager (BUPM)'
            ||
            pirateShipSharedService.getRole() === 'NPPM'
            ||
            pirateShipSharedService.getRole() === 'PLPM'
            ||
            pirateShipSharedService.getRole() === 'CXPM'
            ||
            pirateShipSharedService.getRole() === 'OLE'
            ||
            pirateShipSharedService.getRole() === 'SOE'

          )) {
          this.isReadOnly = false;
        }
        break;
      }

    }
  }


  markAsComplete() {
    //console.log('MaskAsComplete');
    let data = {
      "offerId":this.offerId,
      "caseId":this.caseId,
      "moduleName":this.moduleName,
      "status":"Complete"
    }

    this.changestatusService.updateStatus(data).subscribe(obj => {
      this.moduleOfStatus = obj;
      this.mStatus = obj;
    });
    this.ishide = !this.ishide;
    //this.mStatus.status = 'Complete';
  }

  /**
   * Saving the comments.
   */
  saveComments() {
    //console.log('Testing....');
    //console.log('this.cmnt :', this.cmnt);

    let payload : any, temp = new Date().toLocaleString("en-US", {timeZone: "America/los_angeles"});
    //console.log('temp: ', temp);
    let date = new Date(temp).getTime();
    //console.log('date in miliseconds: ', date);
    payload = {
      "offerId": this.offerId,
      "moduleName": this.moduleName,
      "createdBy": this.pirateShipSharedService.getUserName(),
      "description": this.cmnt.description,
      "timestamp": Number(date),
      "userid": this.pirateShipSharedService.getUserId()
    }
    if (this.cmnt.description) {

      this.changestatusService.addComment(payload).subscribe(responsePayload => {
        this.comments = responsePayload;

      });
    }
    this.cmnt.description = '';
  }

  goBackToOfferSetup() {
    //console.log('goBackToOfferSetup...');
    this.router.navigate(['/offerSetup', this.offerId, this.caseId, this.selectedAto]);
  }


  // Get offer Details

  getOfferDetails() {
    this.stakeholderfullService.retrieveOfferDetails(this.offerId).subscribe(offerDetails => {

      this.offerBuilderdata = offerDetails;
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

      this.derivedMM = offerDetails['derivedMM'];
      this.offerName = offerDetails['offerName'];
      this.stakeHolderData = offerDetails['stakeholders'];
      // Get Module Name and Status
      this.getAllModuleData();

      if (this.derivedMM !== 'Not Aligned') {
        this.showMM = true;
      }

      if (Array.isArray(offerDetails['primaryBEList']) && offerDetails['primaryBEList'].length) {
        this.primaryBE = offerDetails['primaryBEList'][0];
      }


      // TTM Info
      this.rightPanelService.displayAverageWeeks(this.primaryBE, this.derivedMM).subscribe(
        (leadTime) => {
          this.noOfWeeksDifference = Number(leadTime['averageOverall']).toFixed(1);
          this.displayLeadTime = true;
        },
        () => {
          this.noOfWeeksDifference = 'N/A';
        }
      );

      // Populate Stake Holder Info
      this.processStakeHolderInfo();
    });
  }

  // Get All the ModuleName and place in order
  getAllModuleData() {
    this.offerSetupService.getModuleData(this.offerId, this.selectedAto, this.functionalRole ).subscribe(data => {
        this.groupData = {};
        this.showGroupData = false;
        this.Options = data['listATOs'];
        data['listSetupDetails'].forEach(group => {

          let groupName = group['groupName']
          if (this.groupData[groupName] == null) {
            this.groupData[groupName] = { 'left': [], 'right': [] };
          }
          if (group['colNum'] == 1) {
            this.groupData[groupName]['left'].push(group);
          } else {
            this.groupData[groupName]['right'].push(group);
          }

        });
        this.sortGroupData();
        this.showGroupData = true;
      }
    );
  }

  // sort the module location
  sortGroupData() {
    this.groupData['Group3']['left'].sort(
      (a, b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
    );
    this.groupData['Group3']['right'].sort(
      (a, b) => (a.rowNum > b.rowNum) ? 1 : ((b.rowNum > a.rowNum) ? -1 : 0)
    );
  }

  // get stakeHolder information
  private processStakeHolderInfo() {
    //console.log('processStakeHolderInfo');
    //console.log('Length: ', this.stakeHolderData.length)
    this.stakeholders = {};

    for (let i = 0; i <= this.stakeHolderData.length - 1; i++) {
      if (this.stakeholders[this.stakeHolderData[i]['offerRole']] == null) {
        this.stakeholders[this.stakeHolderData[i]['offerRole']] = [];
      }
      this.stakeholders[this.stakeHolderData[i]['offerRole']].push({
        userName: this.stakeHolderData[i]['name'],
        emailId: this.stakeHolderData[i]['_id'] + '@cisco.com',
        _id: this.stakeHolderData[i]['_id'],
        businessEntity: this.stakeHolderData[i]['businessEntity'],
        functionalRole: this.stakeHolderData[i]['functionalRole'],
        offerRole: this.stakeHolderData[i]['offerRole'],
        stakeholderDefaults: this.stakeHolderData[i]['stakeholderDefaults']
      });
    }
  }

  changemodalstatus() {
    this.infohelp = 'TESTING...';

    switch (this.moduleName) {
      case 'NPI Licensing': {
        this.infohelp = this.basicmodule_hint.NPI_Licensing;
        break;
      }
      case 'Royalty Setup': {
        this.infohelp = this.basicmodule_hint.Royalty_Setup;
        break;
      }
      case 'Offer Attribution': {
        this.infohelp = this.basicmodule_hint.Offer_Attribution;
        break;
      }
      case 'Export Compliance': {
        this.infohelp = this.basicmodule_hint['Export Compliance'];
        break;
      }
      case 'Test Orderability': {
        this.infohelp = this.basicmodule_hint.Test_Orderability;
        break;
      }
      case 'Pricing Uplift Setup': {
        this.infohelp = this.basicmodule_hint.Pricing_Uplift_Setup;
        break;
      }

    }
    this.isBtnNeeded = false;
    this.ishide = !this.ishide;
  }

  markAsCompleteModal(labelName: string) {
    //console.log('complete' , labelName);
    this.isBtnNeeded = true;
    this.infohelp = '<div style="text-align: center ! important;">Are you sure you would like to mark this as complete? Once completing a module, you will not be able to move it back to \"In-progress\" </div>';
    this.ishide = !this.ishide;
  }

}
