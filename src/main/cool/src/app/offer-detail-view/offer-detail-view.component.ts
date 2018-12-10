import { Component, OnInit } from '@angular/core';
import { OfferDetailViewService } from '../services/offer-detail-view.service';

@Component({
  selector: 'app-offer-detail-view',
  templateUrl: './offer-detail-view.component.html',
  styleUrls: ['./offer-detail-view.component.css']
})
export class OfferDetailViewComponent implements OnInit {

  constructor(private offerDetailViewService: OfferDetailViewService) { }

  ngOnInit() {
  }

  onExportPdf() {
    // this.offerDetailViewService.export().subscribe(data => saveAs(data, `pdf report.pdf`));
  }

}
