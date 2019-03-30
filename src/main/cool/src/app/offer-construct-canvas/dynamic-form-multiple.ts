import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { OfferConstructService } from '@app/services/offer-construct.service';

@Component({
    selector: 'dynamic-form-multiple',
    templateUrl: './dynamic-form-multiple.html',
    styleUrls: ['./dynamic-form-multiple.css']
})
export class DynamicFormMultipleComponent implements OnInit {
    public offerInfo: any;
    public majorOfferInfo: any;
    public minorOfferInfo: any;
    public headerArray: any;
    public tableShowCondition: boolean = false;
    public ismajorSection: boolean = true;
    public minorLineItemsActive: Boolean = false;
    public majorLineItemsActive: Boolean = false;
    public copyAttributeResults: any;
    private results: any;
    private selectedProduct: any = [];
    private selectedGroupName: string;
    private itemsData: any;
    private itemsList: any;
    currenntHeaderName: any;



    constructor(public offerConstructService: OfferConstructService,
        private offerConstructCanvasService: OfferconstructCanvasService) { }

    ngOnInit() {

        this.offerInfo = this.offerConstructService.singleMultipleFormInfo;
        this.majorOfferInfo = this.offerInfo.major;
        this.minorOfferInfo = this.offerInfo.minor;

        this.tableShowCondition = true;
    }



    majorSection() {
        this.ismajorSection = true;
        this.minorLineItemsActive = false;
        this.majorLineItemsActive = true;
    }

    minorSection() {
        this.ismajorSection = false;
        this.majorLineItemsActive = false;
        this.minorLineItemsActive = true;
    }

    onHide() {
        this.offerConstructService.closeAddDetails = false;
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
        this.offerConstructService.closeAddDetails = false;

    }

    closeDialog() {
        let isUdate: boolean = true;
        this.majorOfferInfo.forEach((list, index) => {
            let groupName: any = Object.keys(list);
            this.offerConstructService.singleMultipleFormInfo.major[index][groupName]['productInfo'].forEach((element, index) => {
                let title: any = Object.keys(element);
                element[title].listOfferQuestions.forEach(minorProduct => {
                    minorProduct.currentValue = minorProduct.previousValue;
                });
            });
        });
        this.offerConstructService.closeAddDetails = false;
    }

    replaceOrUpdatevalue(questions, isUdate) {

        if (isUdate) {
            questions.listOfferQuestions.forEach(list => {
                list.previousValue = list.currentValue;
            });
        } else {
            questions.listOfferQuestions.forEach(item => {
                item.currentValue = item.previousValue;
            });
        }
    }


    //search copy and paste in multiple form 

    onTabOpen(e, headerName) {
        this.currenntHeaderName = headerName;
    }

    searchCopyAttributes(event) {
        const searchString = event.query.toUpperCase();
        this.offerConstructCanvasService.searchEgenie(searchString).subscribe((results) => {
            console.log(results);

            this.copyAttributeResults = [...results];
        },
            (error) => {
                this.results = [];
            }
        );

        let checkedValue: any = (<HTMLInputElement><any>document.getElementsByClassName('product_check_box')).value;
        console.log("checkedValue", checkedValue);

    }

    getSelctedProduct(event, records) {
        console.log(event.target.checked);
        console.log(records);
        // if (event.target.checked) {
        //     this.selectedProduct.forEach(element => {
        //         if ((element.groupName == records.groupName) && (element.groupName == records.groupName)) {
        //             this.selectedProduct.push(records);
        //         }
        //     });
        // }
        this.selectedProduct.push(records);
    }

    patchvalueToSelected() {
        let itemsData = this.itemsData;
        // if (this.itemsData) {
        if (itemsData != undefined) {
            this.selectedProduct.forEach(product => {
                if (this.selectedGroupName = product.groupName) {
                    for (let searchValue in itemsData) {
                        // itemsData.forEach(searchValue => {
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

    addItms() {
        if (this.itemsList != undefined) {
            this.offerConstructCanvasService.getPidDetails(this.itemsList.PID).subscribe(items => {
                if (items != undefined) {
                    this.itemsData = items.body;
                } else {
                    console.log("network error");
                }
            }, (err) => { },
                () => { });
        }
    }

    patchToALL() {

        let groupName = this.currenntHeaderName;

        //copy in major section or minor section
        if (this.ismajorSection) {
            this.majorOfferInfo.forEach((element, index) => {
                let gname: any = Object.keys(element);
                if (gname == groupName) {
                    element[gname].productInfo.forEach((questionset, index) => {
                        let setname: any = Object.keys(questionset);
                        this.copySearchItemToAllSection(questionset[setname].listOfferQuestions)
                    });
                }
            });
        } else {
            this.minorOfferInfo.forEach((element, index) => {
                let gname: any = Object.keys(element);
                if (gname == groupName) {
                    element[gname].productInfo.forEach((questionset, index) => {
                        let setname: any = Object.keys(questionset);
                        this.copySearchItemToAllSection(questionset[setname].listOfferQuestions)
                    });
                }
            });
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
}

