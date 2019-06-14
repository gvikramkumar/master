import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';
import { ConfirmationService } from 'primeng/api';
import { CsdlPayload } from '../model/csdl-payload';
import { MessageService } from '@app/services/message.service';
import * as moment from 'moment';

@Component({
  selector: 'app-csdl-status-track',
  templateUrl: './csdl-status-track.component.html',
  styleUrls: ['./csdl-status-track.component.css']
})
export class CsdlStatusTrackComponent implements OnInit {
  public currentOfferId: any;
  caseId: string;
  selectedAto: any;
  csdlData: any[] = [];
  projectId;
  stopShipStatus;
  enforcementLabel;
  csdlMileStoneStatus;
  associationStatusError;
  associationMessage;
  latestUpdatedFormatDate;

  constructor(private activatedRoute: ActivatedRoute,
    private csdlIntegrationService: CsdlIntegrationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
    });
   }

  ngOnInit() {
    this.getUpdatedStatus();
  }

  /**
   * To get the status tracking table data in status tracking page on page load.
   */
  getUpdatedStatus() {
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(data => {
      this.associationStatusError = data.associationStatus;
      this.associationMessage = data.associationMessage;
      this.csdlData = [];
      this.csdlData.push(data);
      this.projectId = data['projectId'];
      this.stopShipStatus = data['stopShipStatus'];
      this.enforcementLabel = data['enforcementLabel'];
      this.csdlMileStoneStatus = data['csdlMileStoneStatus'];
      if (data.latestUpdatedDate === '') {
        this.latestUpdatedFormatDate = moment().format('DD-MMM-YYYY, h:mma');
      } else {
        this.latestUpdatedFormatDate = moment(data.latestUpdatedDate).format('DD-MMM-YYYY, h:mma');
      }
    });
  }

  /**
   * When user click on refresh status button on the abouve status tracking table.
   */
  refreshStatus() {
    this.getUpdatedStatus();
    /**
     * Status combinations:
       Stop Ship - Enforcement - CSDL Activity Status
       True – Warning - COOL will list activity as complete
       True – Enforced - COOL will list activity as Available
       True - None - COOL will list activity as complete
       False - Warning - COOL will list activity as complete
       False – Enforced - COOL will list activity as Available
       False - None - COOL will list activity as complete
    */
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(data => {
      const csdlPayload = new CsdlPayload();
      if (data.stopShipStatus === 'True' && data.enforcementLabel === 'Warning') {
        // Complete
        csdlPayload.csdlMileStoneStatus = 'Complete';
        this.updateCsdlMileStone(csdlPayload.csdlMileStoneStatus);
      } else if (data.stopShipStatus === 'True' && data.enforcementLabel === 'Enforced') {
        // Available
        csdlPayload.csdlMileStoneStatus = 'Available';
        this.updateCsdlMileStone(csdlPayload.csdlMileStoneStatus);
      } else if (data.stopShipStatus === 'True' && data.enforcementLabel === '') {
        // Complete
        csdlPayload.csdlMileStoneStatus = 'Complete';
        this.updateCsdlMileStone(csdlPayload.csdlMileStoneStatus);
      } else if (data.stopShipStatus === 'False' && data.enforcementLabel === 'Warning') {
        // Complete
        csdlPayload.csdlMileStoneStatus = 'Complete';
        this.updateCsdlMileStone(csdlPayload.csdlMileStoneStatus);
      } else if (data.stopShipStatus === 'False' && data.enforcementLabel === 'Enforced') {
        // Available
        csdlPayload.csdlMileStoneStatus = 'Available';
        this.updateCsdlMileStone(csdlPayload.csdlMileStoneStatus);
      } else if (data.stopShipStatus === 'False' && data.enforcementLabel === '') {
        // Complete
        csdlPayload.csdlMileStoneStatus = 'Complete';
        this.updateCsdlMileStone(csdlPayload.csdlMileStoneStatus);
      }
    });
  }

  updateCsdlMileStone(mileStoneStatus) {
    const csdlPayload = new CsdlPayload();
    const csdlPayloadArray: any = [];
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlMileStoneStatus = mileStoneStatus;
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(() => {
    });
  }

  /**
   * When user click on csdl id or project name it will open the new tab with below url.
   */
  securityInsightsTab() {
    let urlToOpen = 'https://wwwin-si.cisco.com/projects/';
    urlToOpen +=  this.projectId;
    urlToOpen += '/?tab=Vital+Signs';
    window.open(urlToOpen, '_blank');
  }

  /**
   * When user click on trash button and it will ask to confirmation dailogue
   */
  removeAssociationConfirmDailog() {
    this.confirmationService.confirm({
      message: `Are you sure you want to proceed? After removing this association you
                will need to identify another CSDL project in order to proceed.`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deAssociation();
      },
      reject: () => {
      }
    });
  }

  /**
   * When user click on trash button and it will ask to confirm proceed to deassciation
   */
  deAssociation() {
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(() => {
      this.setDeAssociation();
    }, (err) => {

    }, () => {

    });
  }

  /**
   * When user click on proceed button and updating the information in the collection
   */
  setDeAssociation() {
    const csdlPayload = new CsdlPayload();
    const csdlPayloadArray: any = [];
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlMileStoneStatus = 'Available';
    csdlPayload.associationStatus = 'nan';
    csdlPayload.projectId = Number('-1');
    csdlPayload.projectType = '';
    csdlPayload.stopShipStatus = '';
    csdlPayload.enforcementLabel = '';
    csdlPayload.latestUpdatedDate = '';
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(() => {
      this.messageService.sendMessage('De Association');
      },
      err => {
        console.log(err);
      }
    );
  }

}
