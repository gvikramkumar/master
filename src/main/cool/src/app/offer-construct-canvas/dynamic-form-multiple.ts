import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { OfferConstructService } from '@app/services/offer-construct.service';

@Component({
    selector: 'dynamic-form-multiple',
    templateUrl: './dynamic-form-multiple.html',
    styleUrls: ['./offer-construct-canvas.component.css'],
})
export class DynamicFormMultipleComponent implements OnInit {
    public offerInfo: any;
    public majorOfferInfo: any;
    public minorOfferInfo: any;
    public headerArray: any;
    public tableShowCondition: boolean = false;
    public ismajorSection: boolean = true;

    cities1: any;


    constructor(public offerConstructService: OfferConstructService) { }

    ngOnInit() {

        console.log("child component");

        this.offerInfo = this.offerConstructService.singleMultipleFormInfo;
        this.majorOfferInfo = this.offerInfo.major;
        this.minorOfferInfo = this.offerInfo.minor;

        this.tableShowCondition = true;

        this.cities1 = [
            { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
            { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
            { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
            { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
            { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
        ];
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

