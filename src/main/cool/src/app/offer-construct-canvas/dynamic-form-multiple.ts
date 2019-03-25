import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { OfferConstructService } from '@app/services/offer-construct.service';

@Component({
    selector: 'dynamic-form-multiple',
    templateUrl: './dynamic-form-multiple.html',
    styles: [`
    .error { color: red; }
    .form-group-add-OfferConfiguration .row-button-add-details{display:none}
    `
    ]
})
export class DynamicFormMultipleComponent implements OnInit {
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

    onHide() {
        this.offerConstructService.closeAddDetails = false;
    }


    closeDialog() {
        this.offerConstructService.closeAddDetails = false;
    }

}

