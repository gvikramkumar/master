import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../../shared/routing-component-base';
import {ActivatedRoute, Router} from '@angular/router';
import {Submeasure} from '../../models/submeasure';
import {AppStore} from '../../../../app/app-store';
import {RuleService} from "../../services/rule.service";
//import {SubmeasureService} from "../../services/submeasure.service";
import {SubmeasureService} from '../../services/submeasure.service';
import {AllocationRule} from "../../models/allocation-rule";
import {Observable, of} from "rxjs/index";
import {MeasureService} from "../../services/measure.service";
import {Measure} from "../../models/measure";

@Component({
  selector: 'fin-submeasure-add',
  templateUrl: './submeasure-edit.component.html',
  styleUrls: ['./submeasure-edit.component.scss']
})
export class SubmeasureEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  title: string;
  submeasure: Submeasure = new Submeasure();


  ruleForms: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private measureService: MeasureService
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.ruleForms.push(0);
    if (this.editMode) {
      this.title = 'Edit Submeasure';
      this.submeasureService.getOneById(this.route.snapshot.params.id)
        .subscribe(submeasure => {
          this.submeasure = submeasure;
          // this.measureNameSelection = this.submeasure.measureName ? this.measureNamesMap[this.submeasure.measureName]: '';
          //this.measureNameSelection = this.submeasure.measureName;
          console.log('measure selection is: ' + this.measureNameSelection);
          this.subMeasureName = submeasure.name;
          this.description = submeasure.description;
          this.source = submeasure.source;


        });
      this.measureService.getMany()
        .subscribe(
          measures => this.measures = measures)
    } else {
      this.title = 'Create Submeasure';
    }
  }
  measures: Measure[] = [];
  subMeasureName: string;
  description: string;
  source: string;
  discountFlag: string;
  reportingLevel1: string;
  reportingLevel2: string;

  rules = [
    {
      "name": "rule1",
      "value": 1,
      "selected":null
    },
    {
      "name": "rule2",
      "value": 2,
      "selected":null
    },
    {
      "name": "rule3",
      "value": 3,
      "selected":null
    },
    {
      "name": "rule4",
      "value": 4,
      "selected":null
    },
    {
      "name": "rule5",
      "value": 5,
      "selected":null
    },
    {
      "name": "rule6",
      "value": 6,
      "selected":null
    }
  ]

  ruleSelected() {

  }

  addRuleHidden: boolean = false;
  removeRuleHidden: boolean = true;

  addRule() {
    this.ruleForms.push(this.ruleForms.length);
    if (this.ruleForms.length >= 5) {
      //add button should disappear
      this.addRuleHidden = true;
    } else {
      this.addRuleHidden = false;
    }

    if (this.ruleForms.length > 1) {
      this.removeRuleHidden = false;
    }

  }

  removeRule() {
    this.ruleForms.pop();
    if (this.ruleForms.length <= 1) {
      //minus button should disappear
      this.removeRuleHidden = true;
    } else {
      this.removeRuleHidden = false;
    }

    if (this.ruleForms.length < 5) {
      this.addRuleHidden = false;
    }
  }
  //measure;
  //measureName: string;
  //measureNameSelection: number;
  measureNameSelection: string;
 /* measureNames = [
    {
      "name": "Indirect Revenue Adjustments",
      "value": 1,
      "selected":null
    },
    {
      "name": "Manufacturing Overhead",
      "value": 2,
      "selected":null
    },
    {
      "name": "Manufacturing Supply Chain Expenses",
      "value": 3,
      "selected":null
    },
    {
      "name": "Manufacturing V&O",
      "value": 4,
      "selected":null
    },
    {
      "name": "Standard COGS Adjustments",
      "value": 5,
      "selected":null
    },
    {
      "name": "Warranty",
      "value": 6,
      "selected":null
    }
  ]*/

  measureNamesMap: {[key: string]: any} = {
    'Indirect Revenue Adjustments':1,
    'Manufacturing Overhead':2,
    'Manufacturing Supply Chain Expenses':3,
    'Manufacturing V&O':4,
    'Standard COGS Adjustments':5,
    'Warranty':6
  }

  categoriesHidden: boolean = true;
  categoryTypes = [
    {
      "name": "HW",
      "value": 1
    },
    {
      "name": "SW",
      "value": 2
    },
    {
      "name": "HMP",
      "value": 3
    },
    {
      "name": "Manual Mix",
      "value": 4
    }
  ]

/*  measureNameSelected() {
    //Make "Submeasure Category Type" field visible if "Standard Cogs" is chosen
    if (this.measureNames[4].selected==true) {
      this.categoriesHidden=false;
    }
    else {
      this.categoriesHidden=true;
    }
  }*/

  categoryTypeSelected() {
  }

  switch_ibe: boolean;
  ibe_items= [
    {
      "name": "Internal BE",
      "value": 1,
      "selected": null
    },
    {
      "name": "Internal Sub BE",
      "value": 2,
      "selected": null
    }
  ]
  switch_le: boolean;
  le_items= [
    {
      "name": "BE",
      "value": 1,
      "selected": null
    }
  ]
  switch_p: boolean;
  p_items= [
    {
      "name": "TG",
      "value": 1,
      "selected": null
    },
    {
      "name": "BU",
      "value": 2,
      "selected": null
    },
    {
      "name": "PF",
      "value": 3,
      "selected": null
    },
    {
      "name": "PID",
      "value": 4,
      "selected": null
    }
  ]
  switch_s: boolean;
  s_items= [
    {
      "name": "Level 1",
      "value": 1,
      "selected": null
    },
    {
      "name": "Level 2",
      "value": 2,
      "selected": null
    },
    {
      "name": "Level 3",
      "value": 3,
      "selected": null
    },
    {
      "name": "Level 4",
      "value": 4,
      "selected": null
    },
    {
      "name": "Level 5",
      "value": 5,
      "selected": null
    },
    {
      "name": "Level 6",
      "value": 6,
      "selected": null
    }
  ]
  switch_scms: boolean;
  scms_items= [
    {
      "name": "SCMS",
      "value": 1,
      "selected": null
    }
  ]

  ibe_hidden: boolean = true;
  le_hidden: boolean = true;
  p_hidden: boolean = true;
  s_hidden: boolean = true;
  scms_hidden: boolean = true;
  ibe_br_hidden: boolean = false;
  le_br_hidden: boolean = false;
  p_br_hidden: boolean = false;
  s_br_hidden: boolean = false;
  scms_br_hidden: boolean = false;

  months = [
    {
      "name": "201806 - Jun18",
      "value": 1,
      "selected": null
    },
    {
      "name": "201805 - May18",
      "value": 2,
      "selected": null
    },
    {
      "name": "201804 - Apr18",
      "value": 3,
      "selected": null
    },
    {
      "name": "201803 - Mar18",
      "value": 4,
      "selected": null
    },
    {
      "name": "201802 - Feb18",
      "value": 5,
      "selected": null
    },
    {
      "name": "201801 - Jan18",
      "value": 6,
      "selected": null
    }
  ]

  timings = [
    {
      "name": "Daily",
      "value": 1,
      "selected": null
    },
    {
      "name": "Weekly",
      "value": 2,
      "selected": null
    },
    {
      "name": "Monthly",
      "value": 3,
      "selected": null
    },
    {
      "name": "Quarterly",
      "value": 4,
      "selected": null
    },
    {
      "name": "WD-5",
      "value": 5,
      "selected": null
    },
    {
      "name": "WD-4",
      "value": 6,
      "selected": null
    },
    {
      "name": "WD-3",
      "value": 7,
      "selected": null
    },
    {
      "name": "WD-2",
      "value": 8,
      "selected": null
    },
    {
      "name": "WD-1",
      "value": 9,
      "selected": null
    },
    {
      "name": "WD0",
      "value": 10,
      "selected": null
    },
    {
      "name": "WD+1",
      "value": 11,
      "selected": null
    },
    {
      "name": "WD+2",
      "value": 12,
      "selected": null
    },
    {
      "name": "WD+3",
      "value": 13,
      "selected": null
    },
    {
      "name": "WD+4",
      "value": 14,
      "selected": null
    },
    {
      "name": "WD+5",
      "value": 15,
      "selected": null
    }
  ]

  discountFlagOptions = [
    {
      "name": "Yes",
      "value": 1
    },
    {
      "name": "No",
      "value": 2
    }
  ]

  groupings = [
    {
      "name": "Indirect Revenue Adjustments",
      "value": 1,
      "selected": null
    }
  ]

  //associatedRule: string;

  test() {
    //empty test function
  }

  groupingSelected() {
    //Actions for when grouping is selected
  }

  ibeChange() {
    //toggle visibility
    this.ibe_hidden = !this.ibe_hidden;
    this.ibe_br_hidden = !this.ibe_br_hidden;

    //If Internal Business Entity is selected, make sure Product is unselected
    if (this.switch_ibe && this.switch_p) {
        this.switch_p = false;
        this.pChange();
    }
  }

  leChange() {
    //toggle visibility
    this.le_hidden = !this.le_hidden;
    this.le_br_hidden = !this.le_br_hidden;
  }

  pChange() {
    //toggle visibility
    this.p_hidden = !this.p_hidden;
    this.p_br_hidden = !this.p_br_hidden;

    //If Product is selected, make sure Internal Business Entity is unselected
    if (this.switch_ibe && this.switch_p) {
        this.switch_ibe = false;
        this.ibeChange();
    }
  }

  sChange() {
    //toggle visibility
    this.s_hidden = !this.s_hidden;
    this.s_br_hidden = !this.s_br_hidden;
  }

  scmsChange() {
    //toggle visibility
    this.scms_hidden = !this.scms_hidden;
    this.scms_br_hidden = !this.scms_br_hidden;
  }

  monthSelected() {
    //Logic for when Effective Month is selected
  }

  timingSelected() {
    //Logic for when timing is selected
  }

  resetForm() {

    console.log("RESETTING FORM");

    this.subMeasureName = "";
    this.description = "";
    this.discountFlag = "";
    this.reportingLevel1 = "";
    this.reportingLevel2 = "";

    /*this.measureNames = [
      {
        "name": "Indirect Revenue Adjustments",
        "value": 1,
        "selected":false
      },
      {
        "name": "Manufacturing Overhead",
        "value": 2,
        "selected":false
      },
      {
        "name": "Manufacturing Supply Chain Expenses",
        "value": 3,
        "selected":false
      },
      {
        "name": "Manufacturing V&O",
        "value": 4,
        "selected":false
      },
      {
        "name": "Standard COGS Adjustments",
        "value": 5,
        "selected":false
      },
      {
        "name": "Warranty",
        "value": 6,
        "selected":false
      }
    ]*/

    this.switch_ibe = false;
    this.ibe_items= [
      {
        "name": "Internal BE",
        "value": 1,
        "selected": null
      },
      {
        "name": "Internal Sub BE",
        "value": 2,
        "selected": null
      }
    ]
    this.switch_le = false;
    this.le_items= [
      {
        "name": "BE",
        "value": 1,
        "selected": null
      }
    ]
    this.switch_p = false;
    this.p_items= [
      {
        "name": "TG",
        "value": 1,
        "selected": null
      },
      {
        "name": "BU",
        "value": 2,
        "selected": null
      },
      {
        "name": "PF",
        "value": 3,
        "selected": null
      },
      {
        "name": "PID",
        "value": 4,
        "selected": null
      }
    ]
    this.switch_s = false;
    this.s_items= [
      {
        "name": "Level 1",
        "value": 1,
        "selected": null
      },
      {
        "name": "Level 2",
        "value": 2,
        "selected": null
      },
      {
        "name": "Level 3",
        "value": 3,
        "selected": null
      },
      {
        "name": "Level 4",
        "value": 4,
        "selected": null
      },
      {
        "name": "Level 5",
        "value": 5,
        "selected": null
      },
      {
        "name": "Level 6",
        "value": 6,
        "selected": null
      }
    ]
    this.switch_scms = false;
    this.scms_items = [
      {
        "name": "SCMS",
        "value": 1,
        "selected": null
      }
    ]

    this.ibe_hidden = true;
    this.le_hidden = true;
    this.p_hidden = true;
    this.s_hidden = true;
    this.scms_hidden = true;
    this.ibe_br_hidden = false;
    this.le_br_hidden = false;
    this.p_br_hidden = false;
    this.s_br_hidden = false;
    this.scms_br_hidden = false;
  }

  formChange() {
    this.submeasure.name = this.subMeasureName;
  }

  public save() {
    //this.formChange();

    this.validate()
      .subscribe(valid => {
        if (valid) {
          this.submeasureService.add(this.submeasure)
            .subscribe(submeasure => this.router.navigateByUrl('/prof/submeasure'));
        }
      })
  }

  validate(): Observable<boolean> {
    //todo: need to search for rule name duplicity on add only
    let obs: Observable<AllocationRule>;
    if (this.editMode) {
      return of(true);
    } else {
      //todo: validate name doesn't exist already. Could be done with an ngModel validator realtime if rules cached
      // otherwise hit server here
      // check for fule name existence in store (if cached rules) or hit the server (why it's observable)
      return of(true);
    }
  }

}

