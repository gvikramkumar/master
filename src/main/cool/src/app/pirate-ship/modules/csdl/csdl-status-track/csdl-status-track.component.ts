import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsdlIntegrationService } from '@app/services/csdl-integration.service';

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
  stopShip;
  enforcement;
  latestStatusUpdate;

  constructor(private activatedRoute: ActivatedRoute,
    private csdlIntegrationService: CsdlIntegrationService) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['offerId'];
      this.caseId = params['caseId'];
      this.selectedAto = params['selectedAto'];
    });
   }

  ngOnInit() {
    this.csdlIntegrationService.getCsdlInfo(this.currentOfferId).subscribe(data => {
      this.csdlData.push(data);
      console.log(data);
    });
  }

}
