import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';
import { ConfirmationService } from 'primeng/api';

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
    private confirmationService: ConfirmationService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
    });
   }

  ngOnInit() {
    this.getUpdatedStatus();
  }

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

  refreshStatus() {
    this.getUpdatedStatus();
  }

  securityInsightsTab() {
    const urlToOpen = 'https://wwwin-si.cisco.com/projects/[CSDL_ID]/?tab=Vital+Signs';
    window.open(urlToOpen, '_blank');
  }

  removeAssociationConfirmDailog() {
    this.confirmationService.confirm({
      message: `Are you sure you want to proceed? After removing this association you
                will need to identify another CSDL project in order to proceed`,
      accept: () => {
      },
      reject: () => {
      }
    });
  }

}
