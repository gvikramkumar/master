import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';
import { ConfirmationService } from 'primeng/api';
import { CsdlPayload } from '../model/csdl-payload';
import { MessageService } from '@app/services/message.service';

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
  csdlId;
  projectId;
  stopShip;
  enforcement;
  latestStatusUpdate;
  stopShipStatus;
  enforcementType;
  csdlMileStoneStatus;

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
      this.csdlData = [];
      this.csdlData.push(data);
      this.projectId = data['projectId'];
      this.stopShipStatus = data['stopShipStatus'];
      this.enforcementType = data['enforcementType'];
      this.csdlMileStoneStatus = data['csdlMileStoneStatus'];
    });
  }

  /**
   * When user click on refresh status button on the abouve status tracking table.
   */
  refreshStatus() {
    this.getUpdatedStatus();
  }

  /**
   * When user click on csdl id or project name it will open the new tab with below url.
   */
  securityInsightsTab() {
    const urlToOpen = 'https://wwwin-si.cisco.com/projects/[CSDL_ID]/?tab=Vital+Signs';
    window.open(urlToOpen, '_blank');
  }

  /**
   * When user click on trash button and it will ask to confirmation dailogue
   */
  removeAssociationConfirmDailog() {
    this.confirmationService.confirm({
      message: `Are you sure you want to proceed? After removing this association you
                will need to identify another CSDL project in order to proceed`,
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
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(data => {
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
    let csdlPayloadArray : any = [];
    csdlPayload.coolOfferId = this.currentOfferId;
    csdlPayload.csdlProjectSelected = 'N';
    csdlPayload.csdlRequired = 'Y';
    csdlPayload.csdlMileStoneStatus = 'Available';
    csdlPayload.associationStatus = 'nan';
    csdlPayload.projectId = '';
    csdlPayload.projectType = '';
    csdlPayloadArray.push(csdlPayload);
    this.csdlIntegrationService.restartCsdlAssociation(csdlPayloadArray).subscribe(data => {
      this.messageService.sendMessage('De Association');
      },
      err => {
        console.log(err);
      }
    );
  }

}
