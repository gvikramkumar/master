import { Component, OnInit } from '@angular/core';
import { OfferConstructService } from '@app/services/offer-construct.service';

@Component({
  selector: 'app-offerconstruct-child',
  templateUrl: './offerconstruct-child.component.html',
  styleUrls: ['./offerconstruct-child.component.scss']
})
export class OfferconstructChildComponent implements OnInit {

  public offerInfo: any;
  public majorOfferInfo: any;
  public minorOfferInfo: any;
  public headerArray: any;
  public tableShowCondition: boolean = false;
  public ismajorSection: boolean = true;
  constructor(public offerConstructService: OfferConstructService) { }

  ngOnInit() {

    console.log("child component");

    this.offerInfo = this.offerConstructService.singleMultipleFormInfo;
    this.majorOfferInfo = this.offerInfo.major;
    this.minorOfferInfo = this.offerInfo.minor;

    this.tableShowCondition = true;

    console.log(this.offerInfo);

  }

  saveJson() {
    console.log(this.offerInfo.hardware);

  }

  majorSection() {
    this.ismajorSection = true;
  }

  minorSection() {
    this.ismajorSection = false;
  }

}
