import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { OfferConstructService } from '../services/offer-construct.service';

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
    @Input() dataObject;
    @Input() group;
    ind;
    form: FormGroup;
    objectProps;
    tempObj: any = {};
    newObj: any[];
    itm: any[];
    data = [];
    savedData;
    showMandatoryDetails: boolean = false;
    myformcontrols: ['item', 'description', 'type']
    @ViewChild('btnadddetails') btnadddetails:ElementRef;
    
    constructor(private offerconstructService: OfferConstructService, private renderer: Renderer) {
    }

    closeDialog() {
        this.offerconstructService.closeAction('close');
    }


    onSubmit(val){
      console.log(this.btnadddetails);
        for (let i = 0; i < this.objectProps.length; i++) {
            this.data.push(this.objectProps[i]);
        }
        let labels = [];
        let values = [];
        for (var key in val) {
            labels.push(key);
            values.push(val[key]);
        }
        let egini = []
        this.data.forEach(i => {
            egini.push(i.egineAttribue)
        })
        var result = {};
        egini.forEach((key, i) => result[key] = values[i]);
        let m =[];
        m[0] = this.group.groupName;
        m[1] = result;
        this.offerconstructService.broadcastTextChange(m);
    }

    openMandatory() {
        this.showMandatoryDetails = !this.showMandatoryDetails;
    }

    ngOnInit() {
      this.offerconstructService.submitClickEvent.subscribe(()=>{
        let event = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
        this.btnadddetails.nativeElement, 'dispatchEvent', [event]);
      })
        this.offerconstructService.formReset.subscribe((val) => {
            if(val==='reset'){
            }
        })
        this.tempObj = this.dataObject;
        // remap the API to be suitable for iterating over it
        this.objectProps =
            Object.keys(this.dataObject)
                .map(prop => {
                    return Object.assign({}, { key: prop },
                        this.dataObject[prop]);
                });
        // setup the form
        const formGroup = {};
        for (let prop of Object.keys(this.dataObject)) {
            formGroup[prop] = new FormControl(this.dataObject[prop].value || '', this.mapValidators(this.dataObject[prop].validation));
        }
        this.form = new FormGroup(formGroup);
    }

    private mapValidators(validators) {
        const formValidators = [];
        if (validators) {
            for (const validation of Object.keys(validators)) {
                if (validation === 'required') {
                    formValidators.push(Validators.required);
                } else if (validation === 'min') {
                    formValidators.push(Validators.min(validators[validation]));
                }
            }
        }
        return formValidators;
    }
}
