import { LoaderService } from '@app/core/services/loader.service';
import { Component, OnInit, Input, Output, ViewChild, ElementRef, Renderer, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OfferConstructService } from '@app/services/offer-construct.service';
import * as moment from 'moment';
import { OfferconstructCanvasService } from '@app/construct/offer-construct-canvas/service/offerconstruct-canvas.service';


@Component({
    selector: 'review-edit-form',
    templateUrl: './review-edit-form.html',
    styleUrls: ['./review-edit-form.css'],
    providers: [DatePipe]
})
export class ReviewEditForm implements OnInit {
    public offerInfo: any;
    public majorOfferInfo: any;
    public minorOfferInfo: any;
    public headerArray: any;
    public tableShowCondition: boolean = false;
    public ismajorSection: boolean = true;
    public minorLineItemsActive: Boolean = false;
    public majorLineItemsActive: Boolean = false;
    public copyAttributeResults: any;
    public results: any;
    public selectedProduct: any = [];
    public selectedTab: string;
    public itemsData: any;
    public itemsList: any = [];
    public lengthList: any;
    public currenntHeaderName: any;
    @Output() valueChange = new EventEmitter();
    public viewDetails: Boolean = false;
    public detailArray: any[] = [];
    public headerName: any = '';
    offerForm: FormGroup;
    onLoad: boolean = false;
    public showLoader: boolean = false;

    @Input() indexVal;

    constructor(public offerConstructService: OfferConstructService,
        private offerConstructCanvasService: OfferconstructCanvasService,
        private loaderService: LoaderService,
        private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.onLoad = true;
        this.offerInfo = {
  "major": [
    {
      "XaaS": {
        "questionset": [],
        "productInfo": []
      }
    },
    {
      "Hardware": {
        "questionset": [
          {
            "eGenieFlag": false,
            "egineAttribue": "Item Name (PID)",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Item Name (PID)",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "Hardware 1",
            "previousValue": "Hardware 1",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Description",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "60",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "First letter Caps, No special characters allowed and max of 60 characters",
              "other": ""
            },
            "question": "Description",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Long Description",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "250",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Long Description",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base Price",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "2 decimal number",
              "other": "numeric with decimals"
            },
            "question": "Base Price",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Pricing Approval Required",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Pricing Approval Required",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Assign to Request ID",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Assign to Request ID",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Requires Royalty Payment Assessment?",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Requires Royalty Payment Assessment?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Discount Restricted Product",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Discount Restricted Product",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Price List Availability",
            "componentType": "Multiselect",
            "itemType": "Unique Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Price List Availability",
            "selectionType": "One or Many",
            "listMutiSelect": [
              {
                "name": "AUST-Australia Price List Ex-Tax"
              },
              {
                "name": "CHINA-CHINA PRICE LIST in US Dollars"
              },
              {
                "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
              },
              {
                "name": "GLBRL-Global Brazil Price List in BRL"
              },
              {
                "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
              },
              {
                "name": "GLEMEA-Global EMEA Price List in US Dollars"
              },
              {
                "name": "GLEMKT-Global Price List Emerging"
              },
              {
                "name": "GLZAR-Global Price List Emerging in ZAR"
              },
              {
                "name": "GLEURO-Global EMEA Price List in Euros"
              },
              {
                "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
              },
              {
                "name": "GLICON-Global Latin America Price List in US Dollars"
              },
              {
                "name": "GLIN-Global India Price List in INR"
              },
              {
                "name": "GLOBAL-Global WorldWide Price List in US Dollars"
              },
              {
                "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
              },
              {
                "name": "GLRUS-Global Price List Russia"
              },
              {
                "name": "GLUS-Global US Price List in US Dollars"
              },
              {
                "name": "GLCH-Global China Price List in Chinese Yuan"
              },
              {
                "name": "JPN-JAPAN Price List in US Dollars"
              },
              {
                "name": "NH-Nihon Price List in Yen"
              },
              {
                "name": "NIHONUSD-Nihon Price List in US Dollars"
              },
              {
                "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
              },
              {
                "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
              },
              {
                "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
              },
              {
                "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
              },
              {
                "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
              },
              {
                "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
              },
              {
                "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
              }
            ],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "GPL Publication",
            "componentType": "Multiselect",
            "itemType": "Unique Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "GPL Publication",
            "selectionType": "One or Many",
            "listMutiSelect": [
              {
                "name": "AUST-Australia Price List Ex-Tax"
              },
              {
                "name": "CHINA-CHINA PRICE LIST in US Dollars"
              },
              {
                "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
              },
              {
                "name": "GLBRL-Global Brazil Price List in BRL"
              },
              {
                "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
              },
              {
                "name": "GLEMEA-Global EMEA Price List in US Dollars"
              },
              {
                "name": "GLEMKT-Global Price List Emerging"
              },
              {
                "name": "GLZAR-Global Price List Emerging in ZAR"
              },
              {
                "name": "GLEURO-Global EMEA Price List in Euros"
              },
              {
                "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
              },
              {
                "name": "GLICON-Global Latin America Price List in US Dollars"
              },
              {
                "name": "GLIN-Global India Price List in INR"
              },
              {
                "name": "GLOBAL-Global WorldWide Price List in US Dollars"
              },
              {
                "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
              },
              {
                "name": "GLRUS-Global Price List Russia"
              },
              {
                "name": "GLUS-Global US Price List in US Dollars"
              },
              {
                "name": "GLCH-Global China Price List in Chinese Yuan"
              },
              {
                "name": "JPN-JAPAN Price List in US Dollars"
              },
              {
                "name": "NH-Nihon Price List in Yen"
              },
              {
                "name": "NIHONUSD-Nihon Price List in US Dollars"
              },
              {
                "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
              },
              {
                "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
              },
              {
                "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
              },
              {
                "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
              },
              {
                "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
              },
              {
                "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
              },
              {
                "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
              }
            ],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Pricing Formula",
            "componentType": "Drop-down",
            "itemType": "Unique Item",
            "values": [
              "Blank",
              "Price List Rate",
              "Rate Table",
              "Qty Based",
              "Term Qty Based"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Pricing Formula",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "$Adjustable",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "$Adjustable",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Stock Eligibility Indicator",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Stock Eligibility Indicator",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Price Effective Date",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Price Effective Date",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Appear on eSale Quoting?",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Appear on eSale Quoting?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Discountable?",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Discountable?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Pricing Methodology",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Pricing Methodology?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Eff. Start Date",
            "componentType": "Date",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Eff. Start Date",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "Jun 12, 2019",
            "previousValue": "Jun 12, 2019",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base Pricing Qty",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Base Pricing Qty",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base Pricing Unit",
            "componentType": "Drop-down",
            "itemType": "Unique Item",
            "values": [
              "YEAR",
              "MONTH",
              "DAY"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Base Pricing Unit",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Create/Update",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Create"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Create/Update",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Item Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "ATO MODEL",
              "CONFIG SPARE",
              "CONFIG SUB",
              "FEATURE PACK",
              "INSTALL",
              "PRODUCT LIST>$0",
              "SPARE"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Item Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Smart Account",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Mandatory",
              "Optional",
              "Blank / Not Enabled"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "License Delivery",
              "selectedOption": "Smart License",
              "defaultSel": "Mandatory",
              "selcount": "1",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Smart Account",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Smart Licensing Enabled",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "License Delivery",
              "selectedOption": "Smart License",
              "defaultSel": "Yes",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Smart Licensing Enabled",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Enable 3rd Party SW Key",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Enable 3rd Party SW Key",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Stack",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Application",
              "Infrastructure",
              "Platform"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software Stack",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Image Signing",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "No Image signing (Digital Software Signatures) is not supported",
              "Yes Image signing (Digital Software Signatures) is supported"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Image Signing",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Delivery Option",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "PHYSICAL",
              "CLOUD",
              "DEVICE SUBSCRIPTION",
              "ELECTRONIC"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Delivery Option",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "End Customer eDelivery Address Required?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "End Customer eDelivery Address Required?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer1",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "1 ) Has this item in any way been designed, developed or modified for military end use, or for telemetry, tracking and control of a satellite, or for use in a satellite",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer2",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does the item contain or enable encryption?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer3",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does this item consist solely of third party product (not manufactured by/for Cisco)?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer4",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "numeric",
              "other": ""
            },
            "question": "Enter in Export Product Review (EPR) number",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Refurbished Item?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Refurbished Item?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Refurbished-Original Item",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "18",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "CAPS",
              "other": ""
            },
            "question": "Refurbished-Original Item",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "License Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "TERM",
              "PERPETUAL"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "License Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Contain Subscriptions",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Device Based",
              "Software Based"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Contain Subscriptions",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "PID Category",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "PID Category",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Does the hardware PID contains embedded Software?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does the hardware PID contains embedded Software?",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "SW% Booking Allocation",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "SW% Booking Allocation",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "TAA Mapping",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "TAA Mapping",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Fulfilment Restriction",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Yes",
              "No",
              "Block",
              "No Stock"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Fulfilment Restriction",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Exclude OA Cascade?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Exclude OA Cascade?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Monetization Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Perpetual",
              "Term",
              "Usage"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Monetization Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "SaaS",
              "On-Premise",
              "System SW",
              "Hybrid"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software Reliability Class",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Product Reliability Class",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UDI Value",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Full UDI Compliance",
              "Will implement Physical visibility only",
              "Will implement Electronic visibility only",
              "Product is an Accessory Kit, Documentation, or Application SW",
              "Product is not serialized",
              "Product is a commodity",
              "OEM/ODM not supporting electronic or physical UDI",
              "Low revenue to implement",
              "No SW support",
              "Other valid business reasons",
              "Product is a soft bundle",
              "MFG verification not possible"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UDI Value",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base PID",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Base PID",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Royalty Max Qty",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Royalty Max Qty",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Restricted to TAA",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "",
              "Yes"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Restricted to TAA",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Country Specific Association",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": "comma seperated no spaces"
            },
            "question": "Country Specific Association",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "ROHS",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": "comma seperated no spaces"
            },
            "question": "ROHS",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UPG Family",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "UPGRADES"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UPG Family",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UPG Group",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "SOFTWARE"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UPG Group",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UPG Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "STANDSW-MJ",
              "STANDSW-MN"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UPG Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Ordering Platform",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Pre-CCW-Web",
              "CCW-Web"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Ordering Platform",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Spare Price",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "numeric",
              "other": ""
            },
            "question": "Spare Price",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Spare Configurable",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Y",
              "N"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Spare Configurable",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Enablement",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Y",
              "N"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Enablement",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Enablement File Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "EMM",
              "Hybrid",
              "Non-EMM"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Enablement File Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Conditional Access",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": "comma seperated no spaces"
            },
            "question": "Conditional Access",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class Answer1",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does it consume power? ",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Briefly describe its function",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Briefly describe its function",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class Answer3",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Explain why you did not choose a class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class Answer1",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Which other Product Family (PF) or BU uses similar or same SW as this SW?",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class Answer2",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Briefly describe the function of this SW:",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class Answer3",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Explain why you did not choose a Class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          }
        ],
        "productInfo": [
          {
            "Hardware_1": {
              "uniqueKey": "1",
              "title": "Hardware 1",
              "uniqueNodeId": "Hardware_1",
              "childCount": 0,
              "isMajor": true,
              "isGroupNode": false,
              "groupName": "Hardware",
              "eGenieFlag": false,
              "listOfferQuestions": [
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Item Name (PID)",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Item Name (PID)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Description",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "60",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "First letter Caps, No special characters allowed and max of 60 characters",
                    "other": ""
                  },
                  "question": "Description",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Long Description",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "250",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Long Description",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Price",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "2 decimal number",
                    "other": "numeric with decimals"
                  },
                  "question": "Base Price",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Approval Required",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Approval Required",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Assign to Request ID",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Assign to Request ID",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Requires Royalty Payment Assessment?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Requires Royalty Payment Assessment?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Discount Restricted Product",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Discount Restricted Product",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Price List Availability",
                  "componentType": "Multiselect",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Price List Availability",
                  "selectionType": "One or Many",
                  "listMutiSelect": [
                    {
                      "name": "AUST-Australia Price List Ex-Tax"
                    },
                    {
                      "name": "CHINA-CHINA PRICE LIST in US Dollars"
                    },
                    {
                      "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
                    },
                    {
                      "name": "GLBRL-Global Brazil Price List in BRL"
                    },
                    {
                      "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
                    },
                    {
                      "name": "GLEMEA-Global EMEA Price List in US Dollars"
                    },
                    {
                      "name": "GLEMKT-Global Price List Emerging"
                    },
                    {
                      "name": "GLZAR-Global Price List Emerging in ZAR"
                    },
                    {
                      "name": "GLEURO-Global EMEA Price List in Euros"
                    },
                    {
                      "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
                    },
                    {
                      "name": "GLICON-Global Latin America Price List in US Dollars"
                    },
                    {
                      "name": "GLIN-Global India Price List in INR"
                    },
                    {
                      "name": "GLOBAL-Global WorldWide Price List in US Dollars"
                    },
                    {
                      "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
                    },
                    {
                      "name": "GLRUS-Global Price List Russia"
                    },
                    {
                      "name": "GLUS-Global US Price List in US Dollars"
                    },
                    {
                      "name": "GLCH-Global China Price List in Chinese Yuan"
                    },
                    {
                      "name": "JPN-JAPAN Price List in US Dollars"
                    },
                    {
                      "name": "NH-Nihon Price List in Yen"
                    },
                    {
                      "name": "NIHONUSD-Nihon Price List in US Dollars"
                    },
                    {
                      "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
                    },
                    {
                      "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
                    },
                    {
                      "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
                    },
                    {
                      "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
                    },
                    {
                      "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
                    },
                    {
                      "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
                    },
                    {
                      "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
                    }
                  ],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "GPL Publication",
                  "componentType": "Multiselect",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "GPL Publication",
                  "selectionType": "One or Many",
                  "listMutiSelect": [
                    {
                      "name": "AUST-Australia Price List Ex-Tax"
                    },
                    {
                      "name": "CHINA-CHINA PRICE LIST in US Dollars"
                    },
                    {
                      "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
                    },
                    {
                      "name": "GLBRL-Global Brazil Price List in BRL"
                    },
                    {
                      "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
                    },
                    {
                      "name": "GLEMEA-Global EMEA Price List in US Dollars"
                    },
                    {
                      "name": "GLEMKT-Global Price List Emerging"
                    },
                    {
                      "name": "GLZAR-Global Price List Emerging in ZAR"
                    },
                    {
                      "name": "GLEURO-Global EMEA Price List in Euros"
                    },
                    {
                      "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
                    },
                    {
                      "name": "GLICON-Global Latin America Price List in US Dollars"
                    },
                    {
                      "name": "GLIN-Global India Price List in INR"
                    },
                    {
                      "name": "GLOBAL-Global WorldWide Price List in US Dollars"
                    },
                    {
                      "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
                    },
                    {
                      "name": "GLRUS-Global Price List Russia"
                    },
                    {
                      "name": "GLUS-Global US Price List in US Dollars"
                    },
                    {
                      "name": "GLCH-Global China Price List in Chinese Yuan"
                    },
                    {
                      "name": "JPN-JAPAN Price List in US Dollars"
                    },
                    {
                      "name": "NH-Nihon Price List in Yen"
                    },
                    {
                      "name": "NIHONUSD-Nihon Price List in US Dollars"
                    },
                    {
                      "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
                    },
                    {
                      "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
                    },
                    {
                      "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
                    },
                    {
                      "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
                    },
                    {
                      "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
                    },
                    {
                      "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
                    },
                    {
                      "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
                    }
                  ],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Formula",
                  "componentType": "Drop-down",
                  "itemType": "Unique Item",
                  "values": [
                    "Blank",
                    "Price List Rate",
                    "Rate Table",
                    "Qty Based",
                    "Term Qty Based"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Formula",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "$Adjustable",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "$Adjustable",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Stock Eligibility Indicator",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Stock Eligibility Indicator",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Price Effective Date",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Price Effective Date",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Appear on eSale Quoting?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Appear on eSale Quoting?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Discountable?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Discountable?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Methodology",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Methodology?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Eff. Start Date",
                  "componentType": "Date",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Eff. Start Date",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "May 15, 2019",
                  "previousValue": "May 15, 2019",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Pricing Qty",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base Pricing Qty",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Pricing Unit",
                  "componentType": "Drop-down",
                  "itemType": "Unique Item",
                  "values": [
                    "YEAR",
                    "MONTH",
                    "DAY"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base Pricing Unit",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Create/Update",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Create"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Create/Update",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Item Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "ATO MODEL",
                    "CONFIG SPARE",
                    "CONFIG SUB",
                    "FEATURE PACK",
                    "INSTALL",
                    "PRODUCT LIST>$0",
                    "SPARE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Item Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Smart Account",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Mandatory",
                    "Optional",
                    "Blank / Not Enabled"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "License Delivery",
                    "selectedOption": "Smart License",
                    "defaultSel": "Mandatory",
                    "selcount": "1",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Smart Account",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Smart Licensing Enabled",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "License Delivery",
                    "selectedOption": "Smart License",
                    "defaultSel": "Yes",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Smart Licensing Enabled",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enable 3rd Party SW Key",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enable 3rd Party SW Key",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Stack",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Application",
                    "Infrastructure",
                    "Platform"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Stack",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Image Signing",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "No Image signing (Digital Software Signatures) is not supported",
                    "Yes Image signing (Digital Software Signatures) is supported"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Image Signing",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Delivery Option",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "PHYSICAL",
                    "CLOUD",
                    "DEVICE SUBSCRIPTION",
                    "ELECTRONIC"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Delivery Option",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "End Customer eDelivery Address Required?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "End Customer eDelivery Address Required?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer1",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "1 ) Has this item in any way been designed, developed or modified for military end use, or for telemetry, tracking and control of a satellite, or for use in a satellite",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer2",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does the item contain or enable encryption?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer3",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does this item consist solely of third party product (not manufactured by/for Cisco)?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer4",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Enter in Export Product Review (EPR) number",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Refurbished Item?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Refurbished Item?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Refurbished-Original Item",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "18",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "CAPS",
                    "other": ""
                  },
                  "question": "Refurbished-Original Item",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "License Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "TERM",
                    "PERPETUAL"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "License Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Contain Subscriptions",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Device Based",
                    "Software Based"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Contain Subscriptions",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "PID Category",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "PID Category",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Does the hardware PID contains embedded Software?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does the hardware PID contains embedded Software?",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "SW% Booking Allocation",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "SW% Booking Allocation",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "TAA Mapping",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "TAA Mapping",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Fulfilment Restriction",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No",
                    "Block",
                    "No Stock"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Fulfilment Restriction",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Exclude OA Cascade?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Exclude OA Cascade?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Monetization Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Perpetual",
                    "Term",
                    "Usage"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Monetization Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "SaaS",
                    "On-Premise",
                    "System SW",
                    "Hybrid"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Reliability Class",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Product Reliability Class",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UDI Value",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Full UDI Compliance",
                    "Will implement Physical visibility only",
                    "Will implement Electronic visibility only",
                    "Product is an Accessory Kit, Documentation, or Application SW",
                    "Product is not serialized",
                    "Product is a commodity",
                    "OEM/ODM not supporting electronic or physical UDI",
                    "Low revenue to implement",
                    "No SW support",
                    "Other valid business reasons",
                    "Product is a soft bundle",
                    "MFG verification not possible"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UDI Value",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base PID",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base PID",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Royalty Max Qty",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Royalty Max Qty",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Restricted to TAA",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "",
                    "Yes"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Restricted to TAA",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Country Specific Association",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "Country Specific Association",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "ROHS",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "ROHS",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Family",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "UPGRADES"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Family",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Group",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "SOFTWARE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Group",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "STANDSW-MJ",
                    "STANDSW-MN"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Ordering Platform",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Pre-CCW-Web",
                    "CCW-Web"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Ordering Platform",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Spare Price",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Spare Price",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Spare Configurable",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Y",
                    "N"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Spare Configurable",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enablement",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Y",
                    "N"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enablement",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enablement File Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "EMM",
                    "Hybrid",
                    "Non-EMM"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enablement File Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Conditional Access",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "Conditional Access",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer1",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does it consume power? ",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Briefly describe its function",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Briefly describe its function",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer3",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Explain why you did not choose a class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer1",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Which other Product Family (PF) or BU uses similar or same SW as this SW?",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer2",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Briefly describe the function of this SW:",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer3",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Explain why you did not choose a Class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                }
              ]
            }
          },
          {
            "Hardware_3": {
              "uniqueKey": "3",
              "title": "Hardware 1",
              "uniqueNodeId": "Hardware_3",
              "childCount": 0,
              "isMajor": true,
              "isGroupNode": false,
              "groupName": "Hardware",
              "eGenieFlag": false,
              "listOfferQuestions": [
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Item Name (PID)",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Item Name (PID)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "Hardware 1",
                  "previousValue": "Hardware 1",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Description",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "60",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "First letter Caps, No special characters allowed and max of 60 characters",
                    "other": ""
                  },
                  "question": "Description",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Long Description",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "250",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Long Description",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Price",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "2 decimal number",
                    "other": "numeric with decimals"
                  },
                  "question": "Base Price",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Approval Required",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Approval Required",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Assign to Request ID",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Assign to Request ID",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Requires Royalty Payment Assessment?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Requires Royalty Payment Assessment?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Discount Restricted Product",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Discount Restricted Product",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Price List Availability",
                  "componentType": "Multiselect",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Price List Availability",
                  "selectionType": "One or Many",
                  "listMutiSelect": [
                    {
                      "name": "AUST-Australia Price List Ex-Tax"
                    },
                    {
                      "name": "CHINA-CHINA PRICE LIST in US Dollars"
                    },
                    {
                      "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
                    },
                    {
                      "name": "GLBRL-Global Brazil Price List in BRL"
                    },
                    {
                      "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
                    },
                    {
                      "name": "GLEMEA-Global EMEA Price List in US Dollars"
                    },
                    {
                      "name": "GLEMKT-Global Price List Emerging"
                    },
                    {
                      "name": "GLZAR-Global Price List Emerging in ZAR"
                    },
                    {
                      "name": "GLEURO-Global EMEA Price List in Euros"
                    },
                    {
                      "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
                    },
                    {
                      "name": "GLICON-Global Latin America Price List in US Dollars"
                    },
                    {
                      "name": "GLIN-Global India Price List in INR"
                    },
                    {
                      "name": "GLOBAL-Global WorldWide Price List in US Dollars"
                    },
                    {
                      "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
                    },
                    {
                      "name": "GLRUS-Global Price List Russia"
                    },
                    {
                      "name": "GLUS-Global US Price List in US Dollars"
                    },
                    {
                      "name": "GLCH-Global China Price List in Chinese Yuan"
                    },
                    {
                      "name": "JPN-JAPAN Price List in US Dollars"
                    },
                    {
                      "name": "NH-Nihon Price List in Yen"
                    },
                    {
                      "name": "NIHONUSD-Nihon Price List in US Dollars"
                    },
                    {
                      "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
                    },
                    {
                      "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
                    },
                    {
                      "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
                    },
                    {
                      "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
                    },
                    {
                      "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
                    },
                    {
                      "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
                    },
                    {
                      "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
                    }
                  ],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "GPL Publication",
                  "componentType": "Multiselect",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "GPL Publication",
                  "selectionType": "One or Many",
                  "listMutiSelect": [
                    {
                      "name": "AUST-Australia Price List Ex-Tax"
                    },
                    {
                      "name": "CHINA-CHINA PRICE LIST in US Dollars"
                    },
                    {
                      "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
                    },
                    {
                      "name": "GLBRL-Global Brazil Price List in BRL"
                    },
                    {
                      "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
                    },
                    {
                      "name": "GLEMEA-Global EMEA Price List in US Dollars"
                    },
                    {
                      "name": "GLEMKT-Global Price List Emerging"
                    },
                    {
                      "name": "GLZAR-Global Price List Emerging in ZAR"
                    },
                    {
                      "name": "GLEURO-Global EMEA Price List in Euros"
                    },
                    {
                      "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
                    },
                    {
                      "name": "GLICON-Global Latin America Price List in US Dollars"
                    },
                    {
                      "name": "GLIN-Global India Price List in INR"
                    },
                    {
                      "name": "GLOBAL-Global WorldWide Price List in US Dollars"
                    },
                    {
                      "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
                    },
                    {
                      "name": "GLRUS-Global Price List Russia"
                    },
                    {
                      "name": "GLUS-Global US Price List in US Dollars"
                    },
                    {
                      "name": "GLCH-Global China Price List in Chinese Yuan"
                    },
                    {
                      "name": "JPN-JAPAN Price List in US Dollars"
                    },
                    {
                      "name": "NH-Nihon Price List in Yen"
                    },
                    {
                      "name": "NIHONUSD-Nihon Price List in US Dollars"
                    },
                    {
                      "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
                    },
                    {
                      "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
                    },
                    {
                      "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
                    },
                    {
                      "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
                    },
                    {
                      "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
                    },
                    {
                      "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
                    },
                    {
                      "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
                    }
                  ],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Formula",
                  "componentType": "Drop-down",
                  "itemType": "Unique Item",
                  "values": [
                    "Blank",
                    "Price List Rate",
                    "Rate Table",
                    "Qty Based",
                    "Term Qty Based"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Formula",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "$Adjustable",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "$Adjustable",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Stock Eligibility Indicator",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Stock Eligibility Indicator",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Price Effective Date",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Price Effective Date",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Appear on eSale Quoting?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Appear on eSale Quoting?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Discountable?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Discountable?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Methodology",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Methodology?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Eff. Start Date",
                  "componentType": "Date",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Eff. Start Date",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "Jun 12, 2019",
                  "previousValue": "Jun 12, 2019",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Pricing Qty",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base Pricing Qty",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Pricing Unit",
                  "componentType": "Drop-down",
                  "itemType": "Unique Item",
                  "values": [
                    "YEAR",
                    "MONTH",
                    "DAY"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base Pricing Unit",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Create/Update",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Create"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Create/Update",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Item Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "ATO MODEL",
                    "CONFIG SPARE",
                    "CONFIG SUB",
                    "FEATURE PACK",
                    "INSTALL",
                    "PRODUCT LIST>$0",
                    "SPARE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Item Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Smart Account",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Mandatory",
                    "Optional",
                    "Blank / Not Enabled"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "License Delivery",
                    "selectedOption": "Smart License",
                    "defaultSel": "Mandatory",
                    "selcount": "1",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Smart Account",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Smart Licensing Enabled",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "License Delivery",
                    "selectedOption": "Smart License",
                    "defaultSel": "Yes",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Smart Licensing Enabled",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enable 3rd Party SW Key",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enable 3rd Party SW Key",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Stack",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Application",
                    "Infrastructure",
                    "Platform"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Stack",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Image Signing",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "No Image signing (Digital Software Signatures) is not supported",
                    "Yes Image signing (Digital Software Signatures) is supported"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Image Signing",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Delivery Option",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "PHYSICAL",
                    "CLOUD",
                    "DEVICE SUBSCRIPTION",
                    "ELECTRONIC"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Delivery Option",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "End Customer eDelivery Address Required?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "End Customer eDelivery Address Required?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer1",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "1 ) Has this item in any way been designed, developed or modified for military end use, or for telemetry, tracking and control of a satellite, or for use in a satellite",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer2",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does the item contain or enable encryption?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer3",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does this item consist solely of third party product (not manufactured by/for Cisco)?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer4",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Enter in Export Product Review (EPR) number",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Refurbished Item?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Refurbished Item?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Refurbished-Original Item",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "18",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "CAPS",
                    "other": ""
                  },
                  "question": "Refurbished-Original Item",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "License Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "TERM",
                    "PERPETUAL"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "License Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Contain Subscriptions",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Device Based",
                    "Software Based"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Contain Subscriptions",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "PID Category",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "PID Category",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Does the hardware PID contains embedded Software?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does the hardware PID contains embedded Software?",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "SW% Booking Allocation",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "SW% Booking Allocation",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "TAA Mapping",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "TAA Mapping",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Fulfilment Restriction",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No",
                    "Block",
                    "No Stock"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Fulfilment Restriction",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Exclude OA Cascade?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Exclude OA Cascade?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Monetization Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Perpetual",
                    "Term",
                    "Usage"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Monetization Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "SaaS",
                    "On-Premise",
                    "System SW",
                    "Hybrid"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Reliability Class",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Product Reliability Class",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UDI Value",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Full UDI Compliance",
                    "Will implement Physical visibility only",
                    "Will implement Electronic visibility only",
                    "Product is an Accessory Kit, Documentation, or Application SW",
                    "Product is not serialized",
                    "Product is a commodity",
                    "OEM/ODM not supporting electronic or physical UDI",
                    "Low revenue to implement",
                    "No SW support",
                    "Other valid business reasons",
                    "Product is a soft bundle",
                    "MFG verification not possible"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UDI Value",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base PID",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base PID",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Royalty Max Qty",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Royalty Max Qty",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Restricted to TAA",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "",
                    "Yes"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Restricted to TAA",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Country Specific Association",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "Country Specific Association",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "ROHS",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "ROHS",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Family",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "UPGRADES"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Family",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Group",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "SOFTWARE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Group",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "STANDSW-MJ",
                    "STANDSW-MN"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Ordering Platform",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Pre-CCW-Web",
                    "CCW-Web"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Ordering Platform",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Spare Price",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Spare Price",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Spare Configurable",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Y",
                    "N"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Spare Configurable",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enablement",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Y",
                    "N"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enablement",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enablement File Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "EMM",
                    "Hybrid",
                    "Non-EMM"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enablement File Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Conditional Access",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "Conditional Access",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer1",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does it consume power? ",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Briefly describe its function",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Briefly describe its function",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer3",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Explain why you did not choose a class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer1",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Which other Product Family (PF) or BU uses similar or same SW as this SW?",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer2",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Briefly describe the function of this SW:",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer3",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Explain why you did not choose a Class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                }
              ]
            }
          }
        ]
      }
    },
    {
      "License": {
        "questionset": [
          {
            "eGenieFlag": false,
            "egineAttribue": "Item Name (PID)",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Item Name (PID)",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Description",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "60",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "First letter Caps, No special characters allowed and max of 60 characters",
              "other": ""
            },
            "question": "Description",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Long Description",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "250",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Long Description",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base Price",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "2 decimal number",
              "other": "numeric with decimals"
            },
            "question": "Base Price",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Pricing Approval Required",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Pricing Approval Required",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Assign to Request ID",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Assign to Request ID",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Requires Royalty Payment Assessment?",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Requires Royalty Payment Assessment?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Discount Restricted Product",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Discount Restricted Product",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Price List Availability",
            "componentType": "Multiselect",
            "itemType": "Unique Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Price List Availability",
            "selectionType": "One or Many",
            "listMutiSelect": [
              {
                "name": "AUST-Australia Price List Ex-Tax"
              },
              {
                "name": "CHINA-CHINA PRICE LIST in US Dollars"
              },
              {
                "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
              },
              {
                "name": "GLBRL-Global Brazil Price List in BRL"
              },
              {
                "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
              },
              {
                "name": "GLEMEA-Global EMEA Price List in US Dollars"
              },
              {
                "name": "GLEMKT-Global Price List Emerging"
              },
              {
                "name": "GLZAR-Global Price List Emerging in ZAR"
              },
              {
                "name": "GLEURO-Global EMEA Price List in Euros"
              },
              {
                "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
              },
              {
                "name": "GLICON-Global Latin America Price List in US Dollars"
              },
              {
                "name": "GLIN-Global India Price List in INR"
              },
              {
                "name": "GLOBAL-Global WorldWide Price List in US Dollars"
              },
              {
                "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
              },
              {
                "name": "GLRUS-Global Price List Russia"
              },
              {
                "name": "GLUS-Global US Price List in US Dollars"
              },
              {
                "name": "GLCH-Global China Price List in Chinese Yuan"
              },
              {
                "name": "JPN-JAPAN Price List in US Dollars"
              },
              {
                "name": "NH-Nihon Price List in Yen"
              },
              {
                "name": "NIHONUSD-Nihon Price List in US Dollars"
              },
              {
                "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
              },
              {
                "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
              },
              {
                "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
              },
              {
                "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
              },
              {
                "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
              },
              {
                "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
              },
              {
                "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
              }
            ],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "GPL Publication",
            "componentType": "Multiselect",
            "itemType": "Unique Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "GPL Publication",
            "selectionType": "One or Many",
            "listMutiSelect": [
              {
                "name": "AUST-Australia Price List Ex-Tax"
              },
              {
                "name": "CHINA-CHINA PRICE LIST in US Dollars"
              },
              {
                "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
              },
              {
                "name": "GLBRL-Global Brazil Price List in BRL"
              },
              {
                "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
              },
              {
                "name": "GLEMEA-Global EMEA Price List in US Dollars"
              },
              {
                "name": "GLEMKT-Global Price List Emerging"
              },
              {
                "name": "GLZAR-Global Price List Emerging in ZAR"
              },
              {
                "name": "GLEURO-Global EMEA Price List in Euros"
              },
              {
                "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
              },
              {
                "name": "GLICON-Global Latin America Price List in US Dollars"
              },
              {
                "name": "GLIN-Global India Price List in INR"
              },
              {
                "name": "GLOBAL-Global WorldWide Price List in US Dollars"
              },
              {
                "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
              },
              {
                "name": "GLRUS-Global Price List Russia"
              },
              {
                "name": "GLUS-Global US Price List in US Dollars"
              },
              {
                "name": "GLCH-Global China Price List in Chinese Yuan"
              },
              {
                "name": "JPN-JAPAN Price List in US Dollars"
              },
              {
                "name": "NH-Nihon Price List in Yen"
              },
              {
                "name": "NIHONUSD-Nihon Price List in US Dollars"
              },
              {
                "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
              },
              {
                "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
              },
              {
                "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
              },
              {
                "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
              },
              {
                "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
              },
              {
                "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
              },
              {
                "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
              },
              {
                "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
              }
            ],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Quantity Delivery Preference",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "NOT ENABLED",
              "SINGLE",
              "SINGLE/MULTIPLE"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "1",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Product Quantity Delivery Preference",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Pricing Formula",
            "componentType": "Drop-down",
            "itemType": "Unique Item",
            "values": [
              "Blank",
              "Price List Rate",
              "Rate Table",
              "Qty Based",
              "Term Qty Based"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Pricing Formula",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "$Adjustable",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "$Adjustable",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Stock Eligibility Indicator",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Stock Eligibility Indicator",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Price Effective Date",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Price Effective Date",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Appear on eSale Quoting?",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Appear on eSale Quoting?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Discountable?",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Discountable?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Pricing Methodology",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Pricing Methodology?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Eff. Start Date",
            "componentType": "Date",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Eff. Start Date",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "04/24/2019",
            "previousValue": "04/24/2019",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base Pricing Qty",
            "componentType": "Free Text",
            "itemType": "Unique Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Base Pricing Qty",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Base Pricing Unit",
            "componentType": "Drop-down",
            "itemType": "Unique Item",
            "values": [
              "YEAR",
              "MONTH",
              "DAY"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Base Pricing Unit",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Create/Update",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Create"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Create/Update",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Item Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "ATO MODEL",
              "CONFIG SPARE",
              "CONFIG SUB",
              "FEATURE PACK",
              "INSTALL",
              "PRODUCT LIST>$0",
              "SPARE"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Item Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Smart Account",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Mandatory",
              "Optional",
              "Blank / Not Enabled"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "License Delivery",
              "selectedOption": "Smart License",
              "defaultSel": "Mandatory",
              "selcount": "1",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Smart Account",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Smart Licensing Enabled",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "License Delivery",
              "selectedOption": "Smart License",
              "defaultSel": "Yes",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Smart Licensing Enabled",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Stack",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Application",
              "Infrastructure",
              "Platform"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software Stack",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Enable 3rd Party SW Key",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Enable 3rd Party SW Key",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Image Signing",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "No Image signing (Digital Software Signatures) is not supported",
              "Yes Image signing (Digital Software Signatures) is supported"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Image Signing",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Delivery Option",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "CLOUD",
              "DEVICE SUBSCRIPTION",
              "ELECTRONIC"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Delivery Option",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "End Customer eDelivery Address Required?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "End Customer eDelivery Address Required?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer1",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "1 ) Has this item in any way been designed, developed or modified for military end use, or for telemetry, tracking and control of a satellite, or for use in a satellite",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer2",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does the item contain or enable encryption?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer3",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does this item consist solely of third party product (not manufactured by/for Cisco)?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Export Compliance Answer4",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "numeric",
              "other": ""
            },
            "question": "Enter in Export Product Review (EPR) number",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Refurbished Item?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Refurbished Item?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Refurbished-Original Item",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "Yes",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "18",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "CAPS",
              "other": ""
            },
            "question": "Refurbished-Original Item",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Entitlement Term",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "numeric",
              "other": "Whole number only"
            },
            "question": "Entitlement Term",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Quantity Based Tiered Pricing",
            "componentType": "Radio Button",
            "itemType": "Unique Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Quantity Based Tiered Pricing",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software License",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software License",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "License Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "TERM",
              "PERPETUAL"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "License Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Contain Subscriptions",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Device Based",
              "Software Based"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Contain Subscriptions",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "PID Category",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "PID Category",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Does the hardware PID contains embedded Software?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does the hardware PID contains embedded Software?",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Entitlement Term",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "numeric",
              "other": ""
            },
            "question": "Entitlement Term",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "SW% Booking Allocation",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "SW% Booking Allocation",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Exclude OA Cascade?",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Exclude OA Cascade?",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Monetization Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Perpetual",
              "Term",
              "Usage"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Monetization Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "SaaS",
              "On-Premise",
              "System SW",
              "Hybrid"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Software Reliability Class",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Product Reliability Class",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Royalty Max Qty",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Royalty Max Qty",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Country Specific Association",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": "comma seperated no spaces"
            },
            "question": "Country Specific Association",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "ROHS",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": "comma seperated no spaces"
            },
            "question": "ROHS",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UPG Family",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "UPGRADES"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UPG Family",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UPG Group",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "SOFTWARE"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UPG Group",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "UPG Type",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "STANDSW-MJ",
              "STANDSW-MN"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "UPG Type",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Ordering Platform",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Pre-CCW-Web",
              "CCW-Web"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Ordering Platform",
            "selectionType": "One",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Spare Price",
            "componentType": "Free Text",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "numeric",
              "other": ""
            },
            "question": "Spare Price",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Spare Configurable",
            "componentType": "Radio Button",
            "itemType": "Item",
            "values": [
              "Y",
              "N"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Spare Configurable",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class Answer1",
            "componentType": "Q&A Radio Button",
            "itemType": "Item",
            "values": [
              "Yes",
              "No"
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Does it consume power? ",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class Answer2",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Briefly describe its function",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Product Reliability Class Answer3",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Explain why you did not choose a class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class Answer1",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Which other Product Family (PF) or BU uses similar or same SW as this SW?",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class Answer2",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Briefly describe the function of this SW:",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Software Reliability Class Answer3",
            "componentType": "Q&A FreeText",
            "itemType": "Item",
            "values": [
              ""
            ],
            "rules": {
              "isMandatoryOptional": "Mandatory",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Explain why you did not choose a Class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          },
          {
            "eGenieFlag": false,
            "egineAttribue": "Try And Buy",
            "componentType": "Drop-down",
            "itemType": "Item",
            "values": [
              "Try and Buy Only",
              "Not Try and Buy"
            ],
            "rules": {
              "isMandatoryOptional": "Optional",
              "referenceQ": "",
              "selectedOption": "",
              "defaultSel": "",
              "selcount": "",
              "maxCharacterLen": "",
              "isURL": "",
              "isegineAtt": "",
              "dateformat": "",
              "textcase": "",
              "other": ""
            },
            "question": "Try And Buy",
            "selectionType": "",
            "listMutiSelect": [],
            "currentValue": "",
            "previousValue": "",
            "eGenieExistingPid": false
          }
        ],
        "productInfo": [
          {
            "License_2": {
              "uniqueKey": "2",
              "title": "License 1",
              "uniqueNodeId": "License_2",
              "childCount": 0,
              "isMajor": true,
              "isGroupNode": false,
              "groupName": "License",
              "eGenieFlag": false,
              "listOfferQuestions": [
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Item Name (PID)",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Item Name (PID)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Description",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "60",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "First letter Caps, No special characters allowed and max of 60 characters",
                    "other": ""
                  },
                  "question": "Description",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Long Description",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "250",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Long Description",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Price",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "2 decimal number",
                    "other": "numeric with decimals"
                  },
                  "question": "Base Price",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Approval Required",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Approval Required",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Assign to Request ID",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Assign to Request ID",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Requires Royalty Payment Assessment?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Requires Royalty Payment Assessment?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Discount Restricted Product",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Discount Restricted Product",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Price List Availability",
                  "componentType": "Multiselect",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Price List Availability",
                  "selectionType": "One or Many",
                  "listMutiSelect": [
                    {
                      "name": "AUST-Australia Price List Ex-Tax"
                    },
                    {
                      "name": "CHINA-CHINA PRICE LIST in US Dollars"
                    },
                    {
                      "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
                    },
                    {
                      "name": "GLBRL-Global Brazil Price List in BRL"
                    },
                    {
                      "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
                    },
                    {
                      "name": "GLEMEA-Global EMEA Price List in US Dollars"
                    },
                    {
                      "name": "GLEMKT-Global Price List Emerging"
                    },
                    {
                      "name": "GLZAR-Global Price List Emerging in ZAR"
                    },
                    {
                      "name": "GLEURO-Global EMEA Price List in Euros"
                    },
                    {
                      "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
                    },
                    {
                      "name": "GLICON-Global Latin America Price List in US Dollars"
                    },
                    {
                      "name": "GLIN-Global India Price List in INR"
                    },
                    {
                      "name": "GLOBAL-Global WorldWide Price List in US Dollars"
                    },
                    {
                      "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
                    },
                    {
                      "name": "GLRUS-Global Price List Russia"
                    },
                    {
                      "name": "GLUS-Global US Price List in US Dollars"
                    },
                    {
                      "name": "GLCH-Global China Price List in Chinese Yuan"
                    },
                    {
                      "name": "JPN-JAPAN Price List in US Dollars"
                    },
                    {
                      "name": "NH-Nihon Price List in Yen"
                    },
                    {
                      "name": "NIHONUSD-Nihon Price List in US Dollars"
                    },
                    {
                      "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
                    },
                    {
                      "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
                    },
                    {
                      "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
                    },
                    {
                      "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
                    },
                    {
                      "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
                    },
                    {
                      "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
                    },
                    {
                      "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
                    }
                  ],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "GPL Publication",
                  "componentType": "Multiselect",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "GPL Publication",
                  "selectionType": "One or Many",
                  "listMutiSelect": [
                    {
                      "name": "AUST-Australia Price List Ex-Tax"
                    },
                    {
                      "name": "CHINA-CHINA PRICE LIST in US Dollars"
                    },
                    {
                      "name": "GLASIA-Global ASIA-PAC Price List in US Dollars"
                    },
                    {
                      "name": "GLBRL-Global Brazil Price List in BRL"
                    },
                    {
                      "name": "GLCA-Global Canada Price List in CANADIAN Dollars"
                    },
                    {
                      "name": "GLEMEA-Global EMEA Price List in US Dollars"
                    },
                    {
                      "name": "GLEMKT-Global Price List Emerging"
                    },
                    {
                      "name": "GLZAR-Global Price List Emerging in ZAR"
                    },
                    {
                      "name": "GLEURO-Global EMEA Price List in Euros"
                    },
                    {
                      "name": "GLGB-Global United Kingdom Price List in Pounds Sterling"
                    },
                    {
                      "name": "GLICON-Global Latin America Price List in US Dollars"
                    },
                    {
                      "name": "GLIN-Global India Price List in INR"
                    },
                    {
                      "name": "GLOBAL-Global WorldWide Price List in US Dollars"
                    },
                    {
                      "name": "GLRU2-Global Russia DDP PriceList in US Dollars"
                    },
                    {
                      "name": "GLRUS-Global Price List Russia"
                    },
                    {
                      "name": "GLUS-Global US Price List in US Dollars"
                    },
                    {
                      "name": "GLCH-Global China Price List in Chinese Yuan"
                    },
                    {
                      "name": "JPN-JAPAN Price List in US Dollars"
                    },
                    {
                      "name": "NH-Nihon Price List in Yen"
                    },
                    {
                      "name": "NIHONUSD-Nihon Price List in US Dollars"
                    },
                    {
                      "name": "WAS2-WHOLESALE ASIA-PAC PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WAU2-WHOLESALE AUSTRALIA PRICE LIST EX-TAX, (2-TIER ONLY)"
                    },
                    {
                      "name": "WBRL-WHOLESALE BRAZIL PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCA2-WHOLESALE CANADA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCH2-WHOLESALE CHINA PRICE LIST IN USD"
                    },
                    {
                      "name": "WEM2-WHOLESALE EMEA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WEMKT-WHOLESALE PRICE LIST EMERGING (2-TIER ONLY)"
                    },
                    {
                      "name": "WIC2-WHOLESALE LATIN AMERICA PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WNH2-WHOLESALE Nihon Price List in Japanese Yen ( 2-TIER ONLY )"
                    },
                    {
                      "name": "WRU2-Wholesale Russia DDP PriceList in US Dollars (2-TIER ONLY)"
                    },
                    {
                      "name": "WRUS-WHOLESALE PRICE LIST RUSSIA (2-TIER ONLY)"
                    },
                    {
                      "name": "WUS2-WHOLESALE US PRICE LIST (2-TIER ONLY)"
                    },
                    {
                      "name": "WCY2-WHOLESALE CHINA PRICE LIST IN CNY (2-TIER ONLY)"
                    }
                  ],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Quantity Delivery Preference",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "NOT ENABLED",
                    "SINGLE",
                    "SINGLE/MULTIPLE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "1",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Product Quantity Delivery Preference",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Formula",
                  "componentType": "Drop-down",
                  "itemType": "Unique Item",
                  "values": [
                    "Blank",
                    "Price List Rate",
                    "Rate Table",
                    "Qty Based",
                    "Term Qty Based"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Formula",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "$Adjustable",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "$Adjustable",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Stock Eligibility Indicator",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Stock Eligibility Indicator",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Price Effective Date",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Price Effective Date",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Appear on eSale Quoting?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Appear on eSale Quoting?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Discountable?",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Discountable?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Pricing Methodology",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Pricing Methodology?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Eff. Start Date",
                  "componentType": "Date",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Eff. Start Date",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "04/24/2019",
                  "previousValue": "04/24/2019",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Pricing Qty",
                  "componentType": "Free Text",
                  "itemType": "Unique Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base Pricing Qty",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Base Pricing Unit",
                  "componentType": "Drop-down",
                  "itemType": "Unique Item",
                  "values": [
                    "YEAR",
                    "MONTH",
                    "DAY"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Base Pricing Unit",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Create/Update",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Create"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Create/Update",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Item Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "ATO MODEL",
                    "CONFIG SPARE",
                    "CONFIG SUB",
                    "FEATURE PACK",
                    "INSTALL",
                    "PRODUCT LIST>$0",
                    "SPARE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Item Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Smart Account",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Mandatory",
                    "Optional",
                    "Blank / Not Enabled"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "License Delivery",
                    "selectedOption": "Smart License",
                    "defaultSel": "Mandatory",
                    "selcount": "1",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Smart Account",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Smart Licensing Enabled",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "License Delivery",
                    "selectedOption": "Smart License",
                    "defaultSel": "Yes",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Smart Licensing Enabled",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Stack",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Application",
                    "Infrastructure",
                    "Platform"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Stack",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Enable 3rd Party SW Key",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Enable 3rd Party SW Key",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Image Signing",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "No Image signing (Digital Software Signatures) is not supported",
                    "Yes Image signing (Digital Software Signatures) is supported"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Image Signing",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Delivery Option",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "CLOUD",
                    "DEVICE SUBSCRIPTION",
                    "ELECTRONIC"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Delivery Option",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "End Customer eDelivery Address Required?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "End Customer eDelivery Address Required?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer1",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "1 ) Has this item in any way been designed, developed or modified for military end use, or for telemetry, tracking and control of a satellite, or for use in a satellite",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer2",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does the item contain or enable encryption?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer3",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does this item consist solely of third party product (not manufactured by/for Cisco)?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Export Compliance Answer4",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Enter in Export Product Review (EPR) number",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Refurbished Item?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Refurbished Item?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Refurbished-Original Item",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "Yes",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "18",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "CAPS",
                    "other": ""
                  },
                  "question": "Refurbished-Original Item",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Entitlement Term",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": "Whole number only"
                  },
                  "question": "Entitlement Term",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Quantity Based Tiered Pricing",
                  "componentType": "Radio Button",
                  "itemType": "Unique Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Quantity Based Tiered Pricing",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software License",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software License",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "License Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "TERM",
                    "PERPETUAL"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "License Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Contain Subscriptions",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Device Based",
                    "Software Based"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Contain Subscriptions",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "PID Category",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "PID Category",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Does the hardware PID contains embedded Software?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does the hardware PID contains embedded Software?",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Entitlement Term",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Entitlement Term",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "SW% Booking Allocation",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "SW% Booking Allocation",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Exclude OA Cascade?",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Exclude OA Cascade?",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Monetization Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Perpetual",
                    "Term",
                    "Usage"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Monetization Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "SaaS",
                    "On-Premise",
                    "System SW",
                    "Hybrid"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Software Reliability Class",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Product Reliability Class",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Royalty Max Qty",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Royalty Max Qty",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Country Specific Association",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "Country Specific Association",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "ROHS",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": "comma seperated no spaces"
                  },
                  "question": "ROHS",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Family",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "UPGRADES"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Family",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Group",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "SOFTWARE"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Group",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "UPG Type",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "STANDSW-MJ",
                    "STANDSW-MN"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "UPG Type",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Ordering Platform",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Pre-CCW-Web",
                    "CCW-Web"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Ordering Platform",
                  "selectionType": "One",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Spare Price",
                  "componentType": "Free Text",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "numeric",
                    "other": ""
                  },
                  "question": "Spare Price",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Spare Configurable",
                  "componentType": "Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Y",
                    "N"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Spare Configurable",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer1",
                  "componentType": "Q&A Radio Button",
                  "itemType": "Item",
                  "values": [
                    "Yes",
                    "No"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Does it consume power? ",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer2",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Briefly describe its function",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Product Reliability Class Answer3",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Explain why you did not choose a class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer1",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Which other Product Family (PF) or BU uses similar or same SW as this SW?",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer2",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Briefly describe the function of this SW:",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Software Reliability Class Answer3",
                  "componentType": "Q&A FreeText",
                  "itemType": "Item",
                  "values": [
                    ""
                  ],
                  "rules": {
                    "isMandatoryOptional": "Mandatory",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Explain why you did not choose a Class from the list (did not fit the class,poor description of the class,serves multiple purposes)",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                },
                {
                  "eGenieFlag": false,
                  "egineAttribue": "Try And Buy",
                  "componentType": "Drop-down",
                  "itemType": "Item",
                  "values": [
                    "Try and Buy Only",
                    "Not Try and Buy"
                  ],
                  "rules": {
                    "isMandatoryOptional": "Optional",
                    "referenceQ": "",
                    "selectedOption": "",
                    "defaultSel": "",
                    "selcount": "",
                    "maxCharacterLen": "",
                    "isURL": "",
                    "isegineAtt": "",
                    "dateformat": "",
                    "textcase": "",
                    "other": ""
                  },
                  "question": "Try And Buy",
                  "selectionType": "",
                  "listMutiSelect": [],
                  "currentValue": "",
                  "previousValue": "",
                  "eGenieExistingPid": false
                }
              ]
            }
          }
        ]
      }
    }
  ],
  "minor": [
    {
      "Billing": {
        "questionset": [],
        "productInfo": []
      }
    },
    {
      "Hardware": {
        "questionset": [],
        "productInfo": []
      }
    },
    {
      "License": {
        "questionset": [],
        "productInfo": []
      }
    },
    {
      "SW Subscription Mapped SKU": {
        "questionset": [],
        "productInfo": []
      }
    },
    {
      "Billing SOA": {
        "questionset": [],
        "productInfo": []
      }
    }
  ]
};      this.offerInfo = JSON.parse(this.offerInfo)
        this.majorOfferInfo = this.offerInfo.major;
        this.minorOfferInfo = this.offerInfo.minor;

        this.tableShowCondition = true;
        this.selectedTab = 'major';
        this.createObjectForSearch();
    }

    createObjectForSearch() {
        //create object with blank value for search operation
        let major = {};
        let minor = {};
        this.majorOfferInfo.forEach((element, index) => {
            let name: any = Object.keys(element);
            major[name] = '';
        });
        this.minorOfferInfo.forEach(element => {
            let name: any = Object.keys(element);
            minor[name] = '';
        });
        this.itemsList = { major: major, minor: minor };

    }

    majorSection() {
        this.ismajorSection = true;
        this.minorLineItemsActive = false;
        this.majorLineItemsActive = true;
        this.selectedTab = 'major';
    }

    minorSection() {
        this.onLoad = false;
        this.ismajorSection = false;
        this.majorLineItemsActive = false;
        this.minorLineItemsActive = true;
        this.selectedTab = 'minor';
    }

    onHide() {
        this.offerConstructService.closeAddDetails = false;
        this.closeDialog();
    }

    onHideViewDetailsModal() {
        console.log("test");

        //this.closeDailog(false);  //reset form info
    }

    saveForm() {
        let isUdate: boolean = true;
        this.majorOfferInfo.forEach((list, index) => {
            let groupName: any = Object.keys(list);
            this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
                let title: any = Object.keys(element);
                this.replaceOrUpdatevalue(element[title], isUdate)
            });
        });

        this.minorOfferInfo.forEach((list, index) => {
            let groupName: any = Object.keys(list);
            this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element, index) => {
                let title: any = Object.keys(element);
                this.replaceOrUpdatevalue(element[title], isUdate)
            });
        });

        let counter = 10;
        this.valueChange.emit(counter);
        this.offerConstructService.closeAddDetails = false;
    }

    closeDialog() {
        let isUdate: boolean = true;
        this.majorSection();
        this.majorOfferInfo.forEach((list, index) => {
            let groupName: any = Object.keys(list);
            this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
                let title: any = Object.keys(element);
                if (!element[title].eGenieFlag || element[title].eGenieFlag === false) {
                    element[title].listOfferQuestions.forEach(majorProduct => {
                        if (majorProduct.componentType !== "Multiselect") {
                            majorProduct.currentValue = majorProduct.previousValue;
                        } else {
                            majorProduct.listCurrentValue = majorProduct.listPreviousValue;
                        }
                    });
                }
            });
        });
        this.minorOfferInfo.forEach((list, index) => {
            let groupName: any = Object.keys(list);
            this.offerConstructService.singleMultipleFormInfo.minor[index][groupName]['productInfo'].forEach((element, index) => {
                let title: any = Object.keys(element);
                if (!element[title].eGenieFlag || element[title].eGenieFlag === false) {
                    element[title].listOfferQuestions.forEach(minorProduct => {
                        if (minorProduct.componentType !== "Multiselect") {
                            minorProduct.currentValue = minorProduct.previousValue;
                        } else {
                            minorProduct.listCurrentValue = minorProduct.listPreviousValue;
                        }
                    });
                }
            });
        });
        this.offerConstructService.closeAddDetails = false;
    }

    replaceOrUpdatevalue(questions, isUdate) {
        if (!questions.eGenieFlag || questions.eGenieFlag === false) {
            if (isUdate) {
                questions.listOfferQuestions.forEach(list => {
                    if (list.componentType !== "Multiselect") {
                        list.previousValue = list.currentValue;
                    } else {
                        list.listPreviousValue = list.listCurrentValue;
                    }
                });
            } else {
                questions.listOfferQuestions.forEach(item => {
                    if (item.componentType !== "Multiselect") {
                        item.currentValue = item.previousValue;
                    } else {
                        item.listCurrentValue = item.listPreviousValue;
                    }
                });
            }
        }
    }

    //search copy and paste in multiple form

    onTabOpen(e, headerName) {
        this.currenntHeaderName = headerName;
        // this.itemsList[headerName] = {};

    }

    searchCopyAttributes(event) {
        const searchString = event.query.toUpperCase();
        this.offerConstructCanvasService.searchEgenie(searchString).subscribe((results) => {
            this.showLoader = true;
            this.copyAttributeResults = [...results];
        },
            (error) => {
                this.results = [];
            }
        );
    }

    getSelctedProduct(event, records) {
        if (event.target.checked) {
            if (this.selectedProduct.length == 0) {
                this.selectedProduct.push(records);
            } else {
                this.selectedProduct.forEach(element => {
                    if ((element.groupName == records.groupName) && (element.groupName == records.groupName)) {
                        this.selectedProduct.push(records);
                    } else {
                        this.selectedProduct.push(records);
                    }
                });
            }
        } else {
            if (this.selectedProduct.length > 0) {
                console.log('-- Before remove--- ', this.selectedProduct);
                this.selectedProduct = this.removeFromArray(this.selectedProduct, records.uniqueKey)
                console.log('-- After remove--- ', this.selectedProduct);
            }
        }
    }

    removeFromArray(array, key) {
        let index = array.findIndex(x => x.uniqueKey === key);
        array.splice(index, 1);
        return array;
    }

    patchvalueToSelected(groupName) {
        let itemsData = this.itemsData;
        if (itemsData !== undefined) {
            if (groupName === itemsData['Item Category']) {
                this.selectedProduct.forEach(product => {
                    if (groupName = product.groupName) {
                        for (let searchValue in itemsData) {
                            product.listOfferQuestions.forEach(element => {
                                if (searchValue === element.question) {
                                    element.currentValue = itemsData[searchValue];
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    addItms(groupName) {
        let selectedSection = this.selectedTab;
        let selectedGroup = groupName;
        if (this.showLoader) {
            if (this.itemsList[selectedSection][selectedGroup].PID != undefined) {
                this.headerName = this.itemsList[selectedSection][selectedGroup].PID;
                this.loaderService.startLoading();
                this.offerConstructCanvasService.getPidDetails(this.itemsList[selectedSection][selectedGroup].PID).subscribe(items => {
                    this.loaderService.stopLoading();
                    this.showLoader = false;
                    if (items != undefined) {
                        this.itemsData = items.body;
                    } else {
                        console.log("network error");
                    }
                }, (err) => {
                    this.showLoader = false;
                    this.loaderService.stopLoading();

                }, () => {
                    this.loaderService.stopLoading();
                    this.showLoader = false;
                });
            }
        }
    }
    dateFormat(val){
        if(val!==''){
            return this.datePipe.transform(new Date(val), 'MM/dd/yyyy');
        }
    }
    updateDate(e){
        return this.datePipe.transform(new Date(e), 'MM/dd/yyyy');
    }
    patchToALL(groupName) {

        let itemsData = this.itemsData;
        // copy items from the same ICC type
        if (itemsData !== undefined) {
            if (groupName === itemsData['Item Category']) {
                //copy in major section or minor section
                if (this.ismajorSection) {
                    this.majorOfferInfo.forEach((element, index) => {
                        let gname: any = Object.keys(element);
                        if (gname == groupName) {
                            element[gname].productInfo.forEach((questionset, index) => {
                                let setname: any = Object.keys(questionset);
                                if (!questionset[setname].eGenieFlag) {
                                    this.copySearchItemToAllSection(questionset[setname].listOfferQuestions);
                                }
                            });
                        }
                    });
                } else {
                    this.minorOfferInfo.forEach((element, index) => {
                        let gname: any = Object.keys(element);
                        if (gname == groupName) {
                            element[gname].productInfo.forEach((questionset, index) => {
                                let setname: any = Object.keys(questionset);
                                if (!questionset[setname].eGenieFlag) {
                                    this.copySearchItemToAllSection(questionset[setname].listOfferQuestions);
                                }
                            });
                        }
                    });
                }
            }
        }
    }

    copySearchItemToAllSection(questionset) {
        let itemsData = this.itemsData;
        if (itemsData != undefined) {
            for (let searchValue in itemsData) {
                // itemsData.forEach(searchValue => {
                questionset.forEach(element => {
                    if (searchValue === element.question) {
                        element.currentValue = itemsData[searchValue];
                    }
                });
            }
        }
    }

    displayViewDetails() {
        if (this.itemsData) {
            this.detailArray = [];
            for (let key in this.itemsData) {
                if (key !== 'major/minor') {
                    this.detailArray.push({
                        egenieAttribute: key,
                        value: this.itemsData[key]
                    });
                }
            }
            this.viewDetails = true;
        }
    }

    onHideViewDetails() {
        this.viewDetails = false;
    }


addAllDetailsValidationsonChange(e,question){

    var validatorPattern = '';
    if (question.egineAttribue !== "Item Name (PID)") {
        if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "numeric") {
            // validatorPattern = "^[0-9]*$";
            if(!(/^[0-9]*$/.test(question.currentValue))){
                question.rules.validationMessage = question.egineAttribue+" should be in "+question.rules.textcase;
                question.rules.isvalid = false ;
            }
            else{
                question.rules.validationMessage = "";
                question.rules.isvalid = true;
            }
        }
        if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "camel") {
            if(!(/^(([0-9])|([A-Z0-9][a-z0-9]+))*([A-Z])?$/.test(question.currentValue))){
                question.rules.validationMessage = question.egineAttribue+" should be in "+question.rules.textcase;
                question.rules.isvalid = false ;
            }
            else{
                question.rules.validationMessage = "";
                question.rules.isvalid = true;
            }


        }
        if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "2 decimal number") {
            if(!(/^[0-9]*\.[0-9][0-9]$/.test(question.currentValue))){
                question.rules.validationMessage = question.egineAttribue+" should be in "+question.rules.textcase;
                question.rules.isvalid = false ;
            }
            else{
                question.rules.validationMessage = "";
                question.rules.isvalid = true;
            }
        }
        if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "comma seperate numeric with no space") {
            if(!(/^[0-9]+(,[0-9]+)*$/.test(question.currentValue))){
                question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
                question.rules.isvalid = false ;
            }
            else{
                question.rules.validationMessage = "";
                question.rules.isvalid = true;
            }
        }
        if (typeof question.rules.textcase != 'undefined' && question.rules.textcase === "First letter Caps, No special characters allowed and max of 60 characters") {
            // validatorPattern = "^[A-Z][A-Za-z0-9\\s]*$";
            if(!(/^[A-Z][A-Za-z0-9\\s]*$/.test(question.currentValue))){
                question.rules.validationMessage = question.egineAttribue + " should be in " + question.rules.textcase;
                question.rules.isvalid = false ;
            }
            else{
                question.rules.validationMessage = "";
                question.rules.isvalid = true;
            }
        }
    }

}


}

