import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
//import { MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { RuleByIdInterface } from '../graphql/schema';
import { GetRuleDetailQuery } from '../graphql/queries';

import { MatRadioChange } from '@angular/material/radio';
import { UpdateRuleMutation } from '../graphql/mutations';

@Component({
  selector: 'fin-prof-rule-management-update',
  templateUrl: './rule-management-update.component.html',
  styleUrls: ['./rule-management-update.component.scss']
})
export class RuleManagementUpdateComponent implements OnInit {

  private sub: Subscription;
  public id;
  //form: FormGroup;
  driverNamesAbbrev = ['GLREVMIX', 'MANUALMAP', 'REVPOS', 'SERVMAP', 'SHIPMENT', 'SHIPREV', 'VIP'];
  driverNamesMap: {[key: string]: any} = {
    'GLREVMIX':1,
    'MANUALMAP':2,
    'REVPOS':3,
    'SERVMAP':4,
    'SHIPMENT':5,
    'SHIPREV':6,
    'VIP':7
  }
  driverSelection: number;
  periodNamesMap: {[key: string]: any} = {
    'MTD':1,
    'ROLL6':2,
    'ROLL3':3
  }
  periodSelection: number;
  salesLevelsMap: {[key: string]: any} = {
    'SL1':1,
    'SL2':2,
    'SL3':3,
    'SL4':4,
    'SL5':5,
    'SL6':6
  }
  productLevelsMap: {[key: string]: any} = {
    'BU':1,
    'PF':2,
    'TG':3,
    'PID':4
  }
  scmsLevelsMap: {[key: string]: any} = {
    'SCMS':1
  }
  legalLevelsMap: {[key: string]: any} = {
    'Business Entity':1
  }
  beLevelsMap: {[key: string]: any} = {
    'BE':1,
    'Sub BE':2
  }

  //driverNamesMap[GLREVMIX] = 1;


  //values that bind to form components in HTML
  public rule: any; // use for id
  public ruleName: String;
  //public period: String;
  //public driverName: String;
  public salesMatch: number;
  public productMatch: number;
  public scmsMatch: number;
  public legalMatch: number;
  public beMatch: number;
  public sl1Select: String = "";
  public productSelect: String = "";
  public scmsSelect: String = "";
  public legalSelect: String = "";
  public beSelect: String = "";

  //change when implement SSO auth
  public createdBy: String = "";
  public createDate: String = "";
  public updatedBy: String = "moltman";
  public updateDate: String = "";

  //form values for submitting back to mongo in save()
  // "PERIOD": this.driverPeriods[this.periodSelection-1].name,
  // "DRIVER_NAME": this.driverNamesAbbrev[this.driverNamesMap[this.driverSelection]-1],
  // "SALES_MATCH": this.salesLevels[this.salesMatch-1].name,
  // "PRODUCT_MATCH": this.productLevels[this.productMatch-1].name,
  // "SCMS_MATCH": this.scmsLevels[this.scmsMatch-1].name,
  // "LEGAL_ENTITY_MATCH": this.legalEntityLevels[this.legalMatch-1].name,
  // "BE_MATCH": this.ibeLevels[this.beMatch-1].name,
  public period: String;
  public driverNameAbbrev: String;
  public salesMatchAbbrev: String = "";
  public productMatchAbbrev: String = "";
  public scmsMatchAbbrev: String = "";
  public legalMatchAbbrev: String = "";
  public beMatchAbbrev: String = "";


  constructor(
    //formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo
  ) {
    this.apollo = apollo;
  }

  public ngOnInit(): void {
    const that = this;
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.apollo.watchQuery<RuleByIdInterface>({
      query: GetRuleDetailQuery,
      variables: { "id": this.id }
    //}).subscribe(({ data }) => {
    }).valueChanges.subscribe(({ data }) => {
      that.rule = data.rule;
       //this.form.setValue({title: data.post.title, content: data.post.content});
       this.ruleName = data.rule.RULE_NAME;
       this.driverSelection = this.driverNamesMap[data.rule.DRIVER_NAME];
       //this.driverNames[this.driverNamesMap[data.rule.DRIVER_NAME]-1].selected = true;
       this.periodSelection = this.periodNamesMap[data.rule.PERIOD];
       this.salesMatch = this.salesLevelsMap[data.rule.SALES_MATCH];
       this.productMatch = this.productLevelsMap[data.rule.PRODUCT_MATCH];
       this.scmsMatch = this.scmsLevelsMap[data.rule.SCMS_MATCH];
       this.legalMatch = this.legalLevelsMap[data.rule.LEGAL_ENTITY_MATCH];
       this.beMatch = this.beLevelsMap[data.rule.BE_MATCH];
       this.sl1Select = data.rule.SL1_SELECT,
       this.scmsSelect = data.rule.SCMS_SELECT,
       this.beSelect = data.rule.BE_SELECT

       this.formChange();
       //console.log("driver value is: " + this.driverNamesMap[data.rule.DRIVER_NAME]);
       //console.log("driver name is: " + this.driverNames[this.driverNamesMap[data.rule.DRIVER_NAME]-1].name);
    });

  }


  driverNames = [
    {
      "name": "GL Revenue Mix", //GLREVMIX
      "value": 1,
      "selected":null
    },
    {
      "name": "Manual Mapping", //MANUALMAP
      "value": 2,
      "selected":null
    },
    {
      "name": "POS Revenue", //REVPOS
      "value": 3,
      "selected":null
    },
    {
      "name": "Service Map", //SERVMAP
      "value": 4,
      "selected":null
    },
    {
      "name": "Shipment", //SHIPMENT
      "value": 5,
      "selected":null
    },
    {
      "name": "Shipped Revenue", //SHIPREV
      "value": 6,
      "selected":null
    },
    {
      "name": "VIP Rebates", //VIP
      "value": 7,
      "selected":null
    }
  ]

  driverPeriods = [
    {
      "name": "MTD",
      "value": 1,
      "selected":null
    },
    {
      "name": "ROLL6",
      "value": 2,
      "selected":null
    },
    {
      "name": "ROLL3",
      "value": 3,
      "selected":null
    }
  ]

  salesLevels = [
    {
      "name": "SL1",
      "value": 1,
      "selected":null
    },
    {
      "name": "SL2",
      "value": 2,
      "selected":null
    },
    {
      "name": "SL3",
      "value": 3,
      "selected":null
    },
    {
      "name": "SL4",
      "value": 4,
      "selected":null
    },
    {
      "name": "SL5",
      "value": 5,
      "selected":null
    },
    {
      "name": "SL6",
      "value": 6,
      "selected":null
    }
  ]

  productLevels = [
    {
      "name": "BU",
      "value": 1,
      "selected":null
    },
    {
      "name": "PF",
      "value": 2,
      "selected":null
    },
    {
      "name": "TG",
      "value": 3,
      "selected":null
    },
    {
      "name": "PID",
      "value": 4,
      "selected":null
    }
  ]

  scmsLevels = [
    {
      "name": "SCMS",
      "value": 1,
      "selected":null
    }
  ]

  legalEntityLevels = [
    {
      "name": "Business Entity",
      "value": 1,
      "selected":null
    }
  ]

  ibeLevels = [
    {
      "name": "BE",
      "value": 1,
      "selected":null
    },
    {
      "name": "Sub BE",
      "value": 2,
      "selected":null
    }
  ]

/*   salesSelectionCriteria: string = "";
  productSelectionCriteria: string = "";
  scmsSelectionCriteria: string;
  legalSelectionCriteria: string;
  internalSelectionCriteria: string; */


  formChange() {
    //logic here for form change
    if(this.driverPeriods[this.periodSelection-1].name != null) {
      this.period = this.driverPeriods[this.periodSelection-1].name;
    }
    if(this.driverNamesAbbrev[this.driverSelection-1] != null) {
      this.driverNameAbbrev = this.driverNamesAbbrev[this.driverSelection-1];
    }
    if(this.salesLevels[this.salesMatch-1].name != null) {
      this.salesMatchAbbrev = this.salesLevels[this.salesMatch-1].name;
    }
    if (this.productLevels[this.productMatch-1].name != null) {
      this.productMatchAbbrev = this.productLevels[this.productMatch-1].name;
    }
    if (this.scmsLevels[this.scmsMatch-1].name != null) {
      this.scmsMatchAbbrev = this.scmsLevels[this.scmsMatch-1].name;
    }
    if (this.legalEntityLevels[this.legalMatch-1].name != null) {
      this.legalMatchAbbrev = this.legalEntityLevels[this.legalMatch-1].name;
    }
    if (this.beMatch != null) {
      if (this.ibeLevels[this.beMatch-1].name != null) {
        this.beMatchAbbrev = this.ibeLevels[this.beMatch-1].name;
      }
    }
  }

  public save() {

    //debugging
    console.log("Inside save() function");
    console.log("params: ");
    console.log(this.ruleName);
    console.log(this.period);
    console.log(this.driverNameAbbrev);
    console.log(this.salesMatchAbbrev);
    console.log(this.productMatchAbbrev);
    console.log(this.scmsMatchAbbrev);
    console.log(this.legalMatchAbbrev);
    console.log(this.beMatchAbbrev);
    console.log(this.sl1Select);
    console.log(this.scmsSelect);
    console.log(this.beSelect);
    console.log(this.createdBy);
    console.log(this.createDate);
    console.log(this.updatedBy);
    console.log(this.updateDate);



    // if (!this.form.valid)
    //   return;
    this.apollo.mutate({
      mutation: UpdateRuleMutation,
      variables: {
        "id": this.rule.id,
        "data": {
          "RULE_NAME": this.ruleName,
          // "PERIOD": this.driverPeriods[this.periodSelection-1].name,
          "PERIOD": this.period,
          // "DRIVER_NAME": this.driverNamesAbbrev[this.driverNamesMap[this.driverSelection]-1],
          "DRIVER_NAME": this.driverNameAbbrev,
          // "SALES_MATCH": this.salesLevels[this.salesMatch-1].name,
          "SALES_MATCH": this.salesMatchAbbrev,
          // "PRODUCT_MATCH": this.productLevels[this.productMatch-1].name,
          "PRODUCT_MATCH": this.productMatchAbbrev,
          // "SCMS_MATCH": this.scmsLevels[this.scmsMatch-1].name,
          "SCMS_MATCH": this.scmsMatchAbbrev,
          // "LEGAL_ENTITY_MATCH": this.legalEntityLevels[this.legalMatch-1].name,
          "LEGAL_ENTITY_MATCH": this.legalMatchAbbrev,
          // "BE_MATCH": this.ibeLevels[this.beMatch-1].name,
          "BE_MATCH": this.beMatchAbbrev,
          "SL1_SELECT": this.sl1Select,
          "SCMS_SELECT": this.scmsSelect,
          "BE_SELECT": this.beSelect,
          "CREATED_BY": this.createdBy,
          "CREATE_DATE": this.createDate,
          "UPDATED_BY": this.updatedBy,
          "UPDATE_DATE": this.updateDate
        }
      },
    })
      .take(1)
      .subscribe({
        next: ({ data }) => {
          console.log('edit rule', data);
          // get edit data
          this.router.navigate(['/dfa/rule_management']);
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
        }
      });
  }

}
