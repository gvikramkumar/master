import { LoaderService } from './../shared/loader.service';
import { Component, OnInit, Input, Output, ViewChild, ElementRef, Renderer, EventEmitter } from '@angular/core';
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
        private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.onLoad = true;
        this.offerInfo = this.offerConstructService.singleMultipleFormInfo;
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
}

