import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OfferconstructCanvasService } from './service/offerconstruct-canvas.service';
import { OfferConstructService } from '../services/offer-construct.service';

@Component({
    selector: 'dynamic-form-multiple',
    template: `
    <form novalidate (ngSubmit)="onSubmit(form.value)" [formGroup]="form">
    <div class="form-group">
    <h4>Details for {{group.groupName}}</h4>
    <div class='row flex-row'>
      <div class='col-md-6' *ngFor="let prop of objectProps">
      <div [ngSwitch]="prop.itemType">
      <div *ngSwitchCase="'Item'">
        <label [attr.for]="prop">{{prop.egineAttribue}}</label>
        <div [ngSwitch]="prop.componentType">
        <div class='form-group__text'>
          <input *ngSwitchCase="'Free Text'" 
            [formControlName]="prop.key"
            [id]="prop.key" [type]="prop.type" class="form-control">
            </div>
          <div *ngSwitchCase="'Radio Button'">
            <label *ngFor="let option of prop.values">
              <input
                type="radio"
                (change)='ind=i'
                class="form-control"
                [name]="prop.key"
                [formControlName]="prop.key"
                [value]="option">{{option}}
            </label>
          </div>
          <div class='form-group__text select' *ngSwitchCase="'Drop-down'">
            <select class="form-control" [formControlName]="prop.key">
              <option *ngFor="let option of prop.values" [value]="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="error" *ngIf="form.get(prop.key).invalid && (form.get(prop.key).dirty || form.get(prop.key).touched)">
            <div *ngIf="form.get(prop.key).errors.required">
              {{ prop.label }} is required.
            </div>
          </div>
      </div>
      </div>
      </div>
      </div>
      <div class="divider" style="margin-top: 1%"></div>
      <!-- Unique Item  Mandatory Section -->
      <div class="row">
        <div class="col-md-8">
          <a (click)="openMandatory()"><span class="icon-add-contain"></span> Mandatory Item Attributes</a>
        </div>
        <div class="col-md-4">
          <div class="form-group input--icon half-margin-bottom">
            <div class="form-group__text">
              <input id="input-type-search" type="text" pInputText size="50" placeholder="Copy Attributes" style="width:auto">
              <button type="button" class="link">
                <span class="icon-search"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divider" style="margin-top: 1%"></div>
      <div *ngIf="showMandatoryDetails">
      <div class='row flex-row'>
      <div class='col-md-6' *ngFor="let prop of objectProps; let i=index">
      <div [ngSwitch]="prop.itemType">
      <div *ngSwitchCase="'Unique Item'">
        <label [attr.for]="prop">{{prop.egineAttribue}}</label>
        <div [ngSwitch]="prop.componentType">
        <div class='form-group__text'>
          <input *ngSwitchCase="'Free Text'" 
            [formControlName]="prop.key"
            [id]="prop.key" [type]="prop.type" class="form-control">
            </div>
          <div *ngSwitchCase="'Radio Button'">
            <label *ngFor="let option of prop.values">
              <input
                type="radio"
                (change)='ind=i'
                class="form-control"
                [name]="prop.key"
                [formControlName]="prop.key"
                [value]="option">{{option}}
            </label>
          </div>
          <div class='form-group__text select' *ngSwitchCase="'Drop-down'">
            <select class="form-control" [formControlName]="prop.key">
              <option *ngFor="let option of prop.values" [value]="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="error" *ngIf="form.get(prop.key).invalid && (form.get(prop.key).dirty || form.get(prop.key).touched)">
            <div *ngIf="form.get(prop.key).errors.required">
              {{ prop.label }} is required.
            </div>
          </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      <div class="row">
            <div class="col-md-12 text-right">
              <button class="btn btn--secondary" (click)='closeDialog()'>Cancel</button>
              <button class="btn btn--primary" type="submit">Add Details</button>
            </div>
          </div>
      </div>
    </form>
  `,
    styles: [
        `
    .error { color: red; }
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

    
    constructor(private offerconstructService: OfferConstructService) {
    }

    closeDialog() {
        this.offerconstructService.closeAction('close');
    }


    onSubmit(val){
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
